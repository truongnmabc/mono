"use client";
import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const finishDiagnosticThunk = createAsyncThunk(
    "finishDiagnosticThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { currentTopicId } = state.gameReducer;
        try {
            await db?.testQuestions
                .where("id")
                .equals(currentTopicId)
                .modify((item) => {
                    item.isGamePaused = false;
                    item.status = 1;
                });
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishDiagnosticThunk;
