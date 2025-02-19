"use client";

import { db } from "@/db/db.model";
import { IQuestionOpt } from "@/models/question";
import { ITestBase } from "@/models/tests";
import { RootState } from "@/redux/store";
import { generateRandomNegativeId } from "@/utils/math";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { IGroupExam } from "@/models/tests/tests";

/**
 * Lưu trữ dữ liệu bài kiểm tra chuẩn đoán vào local database (IndexedDB).
 */
export const setDataStoreDiagnostic = async ({
    totalQuestion,
    id,
    topicIds,
    groupExamData,
}: {
    totalQuestion: number;
    id: number;
    topicIds: number[];
    groupExamData: IGroupExam[];
}) => {
    await db?.testQuestions.add({
        id: id,
        totalDuration: 1,
        isGamePaused: false,
        startTime: Date.now(),
        remainingTime: 80,
        gameMode: "diagnosticTest",
        status: 0,
        attemptNumber: 1,
        elapsedTime: 0,
        topicIds,
        groupExamData: groupExamData,
        passingThreshold: 0,
        totalQuestion,
    });
};

export const generateGroupExamData = async ({
    topics,
    questions,
}: {
    topics: ITopicBase[];
    questions: IQuestionOpt[];
}) => {
    return topics.map((topic) => {
        // Lấy danh sách các subtopic thuộc topic hiện tại
        const subtopicIds = topic.topics.map((subtopic) => subtopic.id);

        // Lọc ra danh sách câu hỏi thuộc các subtopic này
        const questionIds = questions
            .filter((question) => subtopicIds.includes(question.subTopicId))
            .map((question) => question.id);

        return {
            topicName: topic.name,
            passingPercent: 0,
            totalQuestion: questionIds.length,
            questionIds,
            topicId: topic.id,
        };
    });
};

/**
 * Lấy danh sách tất cả các topic từ database.
 */
const getTopics = async () => {
    return await db?.topics.toArray();
};

/**
 * Chọn câu hỏi ngẫu nhiên từ danh sách câu hỏi.
 */
export const getRandomQuestion = (questions: IQuestionOpt[]) => {
    const priorityQuestions = questions?.filter(
        (item) => item.level === -1 || item.level === 50
    );

    return (
        priorityQuestions?.[
            Math.floor(Math.random() * priorityQuestions.length)
        ] || questions[Math.floor(Math.random() * questions.length)]
    );
};

/**
 * Xử lý logic khởi tạo bài kiểm tra mới.
 */

export const createNewDiagnosticTest = async () => {
    const id = generateRandomNegativeId();
    const listQuestion: IQuestionOpt[] = [];

    const topics = await getTopics();
    if (!topics?.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: id,
            progressData: [],
        };
    }

    const listSubTopic = topics.flatMap((topic) => topic.topics);
    const subTopicIds = listSubTopic.map((sub) => sub.id);

    if (!subTopicIds.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: id,
            progressData: [],
            attemptNumber: 1,
        };
    }

    // Lấy tất cả câu hỏi của các subTopic trong một lần truy vấn
    const allQuestions = await db?.questions
        .where("subTopicId")
        .anyOf(subTopicIds)
        .toArray();

    if (!allQuestions?.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: id,
            progressData: [],
            attemptNumber: 1,
        };
    }

    for (const subtopic of listSubTopic) {
        const questions = allQuestions.filter(
            (q) => q.subTopicId === subtopic.id
        );
        if (!questions.length) continue;

        const randomItem = getRandomQuestion(questions);
        if (randomItem) {
            listQuestion.push(randomItem);
        }
    }
    const groupExamData = await generateGroupExamData({
        topics,
        questions: listQuestion,
    });
    // Lưu vào IndexedDB
    await setDataStoreDiagnostic({
        totalQuestion: listQuestion.length,
        id,
        topicIds: topics.map((item) => item.id),
        groupExamData,
    });

    return {
        listQuestion,
        isGamePaused: false,
        currentTopicId: id,
        progressData: [],
        attemptNumber: 1,
    };
};

/**
 * Lấy dữ liệu bài kiểm tra đã tồn tại từ database.
 */
export const getExistingDiagnosticTest = async (diagnostic: ITestBase) => {
    const listIds =
        diagnostic.groupExamData?.flatMap((item) => item.questionIds) || [];

    const progressData = await getLocalUserProgress(
        listIds,
        "diagnosticTest",
        diagnostic.attemptNumber
    );

    const quesID =
        diagnostic.groupExamData?.flatMap((item) => item.questionIds) || [];

    const list =
        (await db?.questions.where("id").anyOf(quesID).toArray()) || [];
    const questions = mapQuestionsWithProgress(
        list,
        progressData || []
    ) as IQuestionOpt[];

    return {
        progressData,
        listQuestion: questions,
        isGamePaused: diagnostic.isGamePaused,
        currentTopicId: diagnostic.id,
        attemptNumber: diagnostic.attemptNumber,
    };
};

/**
 * Khởi tạo bài kiểm tra  (Diagnostic Test).
 */
const initDiagnosticTestQuestionThunk = createAsyncThunk(
    "initDiagnosticTest",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        let { isDataFetched } = state.appInfoReducer;

        while (!isDataFetched) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
            isDataFetched = (thunkAPI.getState() as RootState).appInfoReducer
                .isDataFetched;
        }

        const diagnostic = await db?.testQuestions
            .where("gameMode")
            .equals("diagnosticTest")
            .first();

        return diagnostic
            ? await getExistingDiagnosticTest(diagnostic)
            : await createNewDiagnosticTest();
    }
);

export default initDiagnosticTestQuestionThunk;
