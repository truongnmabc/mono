import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IRes = {
    testId?: number;
};

const pauseTestThunk = createAsyncThunk(
    "pauseTestThunk",
    async ({ testId }: IRes, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { currentTopicId, gameMode } = state.gameReducer;
        const id = testId || currentTopicId;

        if (id === -1 || gameMode === "learn") return;
        await db?.testQuestions
            .where("id")
            .equals(id)
            .modify((item) => {
                const currentTime = Date.now();
                const elapsedTimeInSeconds =
                    (currentTime - (item.startTime || 0)) / 1000;

                item.isGamePaused = true;
                item.elapsedTime =
                    (item.elapsedTime || 0) + elapsedTimeInSeconds;
                item.startTime = currentTime;
            });
    }
);

export default pauseTestThunk;
