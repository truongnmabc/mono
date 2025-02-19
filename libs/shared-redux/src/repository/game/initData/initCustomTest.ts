"use client";

import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";
import { IQuestionOpt } from "@/models/question";
const initCustomTestThunk = createAsyncThunk(
    "initCustomTestThunk",
    async (
        {
            testId,
        }: {
            testId?: number;
        },
        thunkAPI
    ) => {
        const state = thunkAPI.getState() as RootState;
        let { isDataFetched } = state.appInfoReducer;

        while (!isDataFetched) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
            isDataFetched = (thunkAPI.getState() as RootState).appInfoReducer
                .isDataFetched;
        }

        const listTests = await db?.testQuestions
            .where("gameMode")
            .equals("customTets")
            .sortBy("createDate"); // Sắp xếp theo ngày tạo
        if (!listTests?.length) return null;

        // Lấy bài test có status = 0
        const currentTest = listTests.find((item) =>
            testId ? item.id === testId : item.status === 0
        );

        if (currentTest) {
            // Xác định vị trí của bài test trong danh sách
            const testIndex = listTests.findIndex(
                (test) => test.id === currentTest.id
            );

            const listIds =
                currentTest.groupExamData.flatMap((i) => i.questionIds) || [];

            const progressData = await getLocalUserProgress(
                listIds,
                "customTets",
                currentTest.attemptNumber
            );

            const remainingTime =
                currentTest.totalDuration * 60 -
                (currentTest?.elapsedTime || 0);

            const questionsFromDb = await db?.questions
                .where("id")
                .anyOf(listIds)
                .toArray();

            const questions = mapQuestionsWithProgress(
                questionsFromDb || [],
                progressData
            ) as IQuestionOpt[];

            return {
                progressData: progressData || [],
                questions,
                currentTopicId: currentTest.id,
                gameMode: "customTets",
                totalDuration: currentTest.totalDuration,
                isGamePaused: currentTest.isGamePaused,
                remainingTime: remainingTime,
                passingThreshold: currentTest.passingThreshold,
                attemptNumber: currentTest.attemptNumber,
                currentSubTopicIndex: testIndex + 1, // Trả về vị trí của bài test trong danh sách
                gameDifficultyLevel:
                    currentTest.gameDifficultyLevel || "newbie",
            };
        }
        return null;
    }
);

export default initCustomTestThunk;
