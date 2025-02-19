import ReviewAnswerResult from "@/components/reviewAnswers";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

const AllQuestions = () => {
    const [tableData, setTabletData] = useState<{
        all: ICurrentGame[];
        defaultData: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }>({
        all: [],
        defaultData: [],
        correct: [],
        incorrect: [],
    });
    const handleGetData = useCallback(async () => {
        const progress = await db?.userProgress.toArray();

        const listIds = progress?.map((item) => item?.id) || [];
        if (!progress || progress.length === 0) return;
        const data = await db?.questions.where("id").anyOf(listIds).toArray();

        if (!data) return;
        const questionMap = new Map(
            progress.map((p) => [p.id, p.selectedAnswers])
        );

        const allQuestions = data.map((question) => ({
            ...question,
            selectedAnswers: questionMap.get(question.id) || [],
        }));

        const correctQuestions: ICurrentGame[] = [];
        const incorrectQuestions: ICurrentGame[] = [];

        allQuestions.forEach((question) => {
            const selectedAnswers = question.selectedAnswers || [];
            const hasIncorrect = selectedAnswers.some(
                (answer) => !answer.correct
            );

            if (hasIncorrect) {
                incorrectQuestions.push(question);
            } else {
                correctQuestions.push(question);
            }
        });

        setTabletData({
            all: allQuestions,
            defaultData: allQuestions,
            correct: correctQuestions,
            incorrect: incorrectQuestions,
        });
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div
            className={clsx("w-full flex-1 flex flex-col transition-all ", {
                "min-h-[400px]": tableData.defaultData.length <= 1,
                "min-h-[820px]": tableData.defaultData.length > 1,
            })}
        >
            <ReviewAnswerResult
                tableData={tableData}
                showFilter={false}
                setTabletData={setTabletData}
                listTopic={[]}
                title=""
                correctIds={[]}
            />
        </div>
    );
};

export default AllQuestions;
