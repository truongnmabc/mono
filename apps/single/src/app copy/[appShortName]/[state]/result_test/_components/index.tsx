"use client";
import { MtUiButton } from "@/components/button";
import MyContainer from "@/components/container";
import ReviewAnswerResult from "@/components/reviewAnswers";
import { TypeParam } from "@/constants";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IQuestionOpt } from "@/models/question";
import { ITopicBase } from "@/models/topics/topicsProgress";
import {
    selectCurrentTopicId,
    selectListQuestion,
    selectPassingThreshold,
} from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DrawerAnswers from "./drawer";
import HeaderResultTest from "./header";
import ItemListTopicResult from "./listTopicResult/item";
import { ResultProvider } from "./resultContext";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { ITestBase } from "@/models/tests";
import { totalPassingPart } from "../../finish/_components/calculate";

export interface ITopicEndTest extends ITopicBase {
    totalQuestion: number;
    correct: number;
}
type IPropsState = {
    listTopic: ITopicEndTest[];
    all: number;
    correct: number;
    passing: number;
};

const fetchData = async (idTopic: number) => {
    const tests = await db?.testQuestions?.get(idTopic);
    return tests;
};
const getFilteredUserProgress = async ({
    questionIds,
    parentId,
    attemptNumber,
}: {
    questionIds: number[];
    parentId: number;
    attemptNumber: number;
}) => {
    if (!questionIds.length) return [];

    // Lấy danh sách userProgress của các câu hỏi
    const userProgress = await db?.userProgress
        .where("id")
        .anyOf(questionIds)
        .toArray();

    if (!userProgress) return [];

    // Lọc ra chỉ những câu trả lời có parentId và attemptNumber phù hợp
    return userProgress.map((progress) => {
        const filteredAnswers = progress.selectedAnswers.filter(
            (answer) =>
                answer.parentId === parentId && answer.turn === attemptNumber
        );

        return {
            ...progress,

            selectedAnswers: filteredAnswers, // Chỉ giữ lại câu trả lời phù hợp
        };
    });
};

const fetchTopicsAndQuestions = async (test: ITestBase) => {
    const ids = test?.groupExamData?.flatMap((item) => item.questionIds) || [];

    const [topics, questions] = await Promise.all([
        db?.topics.where("id").anyOf(test?.topicIds).toArray(),
        db?.questions.where("id").anyOf(ids).toArray(),
    ]);
    return { topics, questions };
};

const getCorrectAnswersCount = (
    topic: ITopicBase,
    userProgress: IUserQuestionProgress[]
) => {
    const listPart = topic.topics.flatMap((subTopic) =>
        subTopic.topics.map((part) => part.id)
    );

    return (
        userProgress.filter(
            (progress) =>
                listPart.includes(progress.parentId) &&
                progress.selectedAnswers.some((i) => i.correct)
        ).length || 0
    );
};

const getTopicStats = (
    topics: ITopicBase[],
    tests: ITestBase,
    userProgress: IUserQuestionProgress[]
) => {
    return topics.map((topic) => ({
        ...topic,
        totalQuestion:
            tests.groupExamData.find((t) => t.topicId === topic.id)
                ?.totalQuestion || 0,
        correct: getCorrectAnswersCount(topic, userProgress),
    }));
};

const separateCorrectAndIncorrectQuestions = (
    questions: IQuestionOpt[],
    userProgress: IUserQuestionProgress[]
) => {
    const correctQuestions = questions.filter((q) =>
        userProgress.some(
            (p) => p.id === q.id && p.selectedAnswers.some((ans) => ans.correct)
        )
    );

    const incorrectQuestions = questions.filter(
        (q) =>
            !userProgress.some(
                (p) =>
                    p.id === q.id &&
                    p.selectedAnswers.some((ans) => ans.correct)
            )
    );

    return { correctQuestions, incorrectQuestions };
};

const calculatePassing = async ({
    progress,
    turn,
}: {
    progress: IUserQuestionProgress[];
    turn: number;
}) => {
    const passingAppInfo = await db?.passingApp.get(-1);

    const passingPart = await totalPassingPart({
        progress,
        averageLevel: passingAppInfo?.averageLevel || 50,
        turn,
    });

    if (passingAppInfo) {
        return (passingPart / passingAppInfo.totalQuestion) * 100;
    }
    return 0;
};

const ResultTestLayout = () => {
    const listQuestion = useAppSelector(selectListQuestion);
    const reviewId = useAppSelector(selectCurrentTopicId);
    const passPercent = useAppSelector(selectPassingThreshold);
    const type = useSearchParams()?.get("type");
    const testId = useSearchParams()?.get("testId");
    const isMobile = useIsMobile();
    const [openDrawer, setOpenDrawer] = useState(false);

    const [correctIds, setCorrectIds] = useState<number[]>([]);
    const [result, setResult] = useState<IPropsState>({
        listTopic: [],
        all: 0,
        correct: 0,
        passing: 0,
    });

    const [tableData, setTabletData] = useState<{
        all: IQuestionOpt[];
        correct: IQuestionOpt[];
        incorrect: IQuestionOpt[];
        defaultData: IQuestionOpt[];
    }>({
        all: [],
        correct: [],
        incorrect: [],
        defaultData: [],
    });

    const handleGetData = useCallback(async () => {
        if (type === TypeParam.review) {
            // Lấy danh sách unique topicId & questionId
            const listTopicIds = [
                ...new Set(listQuestion.map((q) => q.topicId)),
            ];
            const listQuestionIds = [...new Set(listQuestion.map((q) => q.id))];

            // Lấy dữ liệu từ IndexedDB
            const [topics, userProgress] = await Promise.all([
                db?.topics.where("id").anyOf(listTopicIds).toArray() || [],
                db?.userProgress.where("id").anyOf(listQuestionIds).toArray() ||
                    [],
            ]);

            // Lọc câu trả lời theo reviewId
            const filteredProgress = userProgress.map((progress) => ({
                ...progress,
                selectedAnswers: progress.selectedAnswers.filter(
                    (ans) => ans.parentId === reviewId
                ),
            }));

            // Tính điểm passing
            const passing = await calculatePassing({
                progress: filteredProgress,
                turn: 1,
            });

            // Tổng hợp thông tin chủ đề
            const listTopic = topics.map((topic) => {
                const topicQuestions = listQuestion.filter(
                    (q) => q.topicId === topic.id
                );
                return {
                    ...topic,
                    totalQuestion: topicQuestions.length,
                    correct: topicQuestions.filter(
                        (q) => q.selectedAnswer?.correct
                    ).length,
                };
            });

            // Phân loại câu hỏi đúng/sai
            const [correctQuestions, incorrectQuestions] = listQuestion.reduce(
                (acc, q) => {
                    acc[q.selectedAnswer?.correct ? 0 : 1].push(q);
                    return acc;
                },
                [[], []] as [typeof listQuestion, typeof listQuestion]
            );

            // Cập nhật state
            setResult({
                listTopic,
                all: listQuestion.length,
                correct: correctQuestions.length,
                passing,
            });

            setCorrectIds(correctQuestions.map((q) => q.id));

            setTabletData({
                all: listQuestion,
                defaultData: listQuestion,
                incorrect: incorrectQuestions,
                correct: correctQuestions,
            });

            return;
        }

        if (!testId || !type) return;

        const id = Number(testId);
        const tests = await fetchData(id);
        if (!tests) return;

        const questionIds =
            tests?.groupExamData?.flatMap((item) => item.questionIds) || [];

        const userProgress = await getFilteredUserProgress({
            attemptNumber: tests.attemptNumber,
            parentId: id,
            questionIds,
        });
        const { topics, questions } = await fetchTopicsAndQuestions(tests);

        if (!topics || !questions) return;

        const listTopics = getTopicStats(topics, tests, userProgress);

        const { correctQuestions, incorrectQuestions } =
            separateCorrectAndIncorrectQuestions(questions, userProgress);

        const passing = await calculatePassing({
            progress: userProgress,
            turn: tests.attemptNumber,
        });
        setResult({
            listTopic: listTopics,
            all: questions.length,
            correct: correctQuestions.length,
            passing: passing,
        });

        setCorrectIds(correctQuestions.map((i) => i.id));

        setTabletData({
            all: questions,
            incorrect: incorrectQuestions,
            correct: correctQuestions,
            defaultData: questions,
        });
    }, [listQuestion, type, testId, reviewId]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    const handleOpenDrawer = () => setOpenDrawer(true);
    const handleCloseDrawer = () => setOpenDrawer(false);

    const isPass = (result.correct / result.all) * 100 > (passPercent || 0);
    return (
        <ResultProvider
            value={{
                correctIds,
                result,
                setTableData: setTabletData,
                tableData: tableData,
                correct: result.correct,
                isPass: isPass,
                passing: result.passing,
                total: result.all,
                listTopic: result.listTopic,
            }}
        >
            <div className="w-full flex-1">
                <div
                    className={clsx("bg-white  ", {
                        "sm:bg-[#FFE1E1]": !isPass,
                        "sm:bg-[#F2FFFB]": isPass,
                    })}
                >
                    <HeaderResultTest />
                </div>
                <MyContainer className="sm:pb-6 pb-4">
                    {isMobile && type !== TypeParam.diagnosticTest && (
                        <div className="pt-4 ">
                            <MtUiButton
                                block
                                size="large"
                                className="bg-white text-primary border-primary"
                                onClick={handleOpenDrawer}
                            >
                                Review your answers
                            </MtUiButton>
                        </div>
                    )}
                    <div className="text-lg my-2 font-medium sm:hidden">
                        Test Subjects
                    </div>
                    <div className="w-full flex gap-10 justify-between  sm:mt-9">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                            {result.listTopic.map((item) => (
                                <ItemListTopicResult
                                    item={item}
                                    key={item.id}
                                />
                            ))}
                        </div>
                    </div>
                    <DrawerAnswers
                        openDrawer={openDrawer}
                        handleCloseDrawer={handleCloseDrawer}
                    />
                    {type !== TypeParam.diagnosticTest && !isMobile && (
                        <div
                            className={clsx("w-full flex flex-col pt-6  ", {
                                "min-h-[720px]": tableData.all.length > 0,
                            })}
                        >
                            <ReviewAnswerResult
                                tableData={tableData}
                                setTabletData={setTabletData}
                                listTopic={result.listTopic}
                                correctIds={correctIds}
                            />
                        </div>
                    )}
                </MyContainer>
            </div>
        </ResultProvider>
    );
};

export default ResultTestLayout;
