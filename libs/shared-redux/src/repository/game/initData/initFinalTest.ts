"use client";

import { db } from "@/db/db.model";
import { IQuestionOpt } from "@/models/question";
import { IGameMode } from "@/models/tests";
import { RootState } from "@/redux/store";
import { requestGetData } from "@/services/request";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";

const updateDB = async (id: number) => {
    db?.testQuestions.update(id, {
        isGamePaused: false,
        startTime: Date.now(),
    });
};
const initFinalTestThunk = createAsyncThunk(
    "initFinalTestThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        let { isDataFetched } = state.appInfoReducer;

        while (!isDataFetched) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
            isDataFetched = (thunkAPI.getState() as RootState).appInfoReducer
                .isDataFetched;
        }

        const dataStore = await db?.testQuestions
            .where("gameMode")
            .equals("finalTests")
            .first();

        if (dataStore) {
            const listIds =
                dataStore.groupExamData?.flatMap((item) => item.questionIds) ||
                [];

            const questionsDb = await db?.questions
                .where("id")
                .anyOf(listIds)
                .toArray();

            const progressData = await getLocalUserProgress(
                listIds,
                "finalTests",
                dataStore.attemptNumber
            );

            if (progressData && questionsDb) {
                const questions = mapQuestionsWithProgress(
                    questionsDb,
                    progressData
                ) as IQuestionOpt[];
                await updateDB(dataStore.id);
                const remainingTime =
                    dataStore.totalDuration * 60 -
                    (dataStore?.elapsedTime || 0);

                return {
                    questions,
                    progressData,
                    attemptNumber: dataStore.attemptNumber,
                    currentTopicId: dataStore.id,
                    gameMode: "finalTests" as IGameMode,
                    totalDuration: dataStore.totalDuration,
                    isGamePaused: dataStore?.isGamePaused || false,
                    remainingTime: remainingTime,
                };
            }
            return undefined;
        } else {
            const data = await requestGetData({
                url: `asvab/web-data/exam-4886547081986048.json`,
                config: {
                    baseURL:
                        "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
                },
            });

            return {
                questions: data as IQuestionOpt[],
                progressData: [],
                currentTopicId: 4886547081986048,
                gameMode: "finalTests" as IGameMode,
                totalDuration: 150,
                isGamePaused: false,
                remainingTime: 150 * 60,
            };
        }
    }
);

export default initFinalTestThunk;
