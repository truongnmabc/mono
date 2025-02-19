import { db } from "@/db/db.model";
import { IGameMode } from "@/models/tests";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const resumedTestThunk = createAsyncThunk(
    "resumedTestThunk",
    async ({ type }: { type: IGameMode }) => {
        await db?.testQuestions
            .where("gameMode")
            .equals(type)
            .modify((item) => {
                item.attemptNumber = item.attemptNumber + 1;
                item.isGamePaused = false;
                item.elapsedTime = 0;
                item.status = 0;
            });
    }
);

export default resumedTestThunk;

export const updateTimeTest = createAsyncThunk(
    "updateTimeTest",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { currentTopicId } = state.gameReducer;
        await db?.testQuestions
            .where("id")
            .equals(currentTopicId)
            .modify((item) => {
                item.startTime = Date.now();
            });
    }
);
