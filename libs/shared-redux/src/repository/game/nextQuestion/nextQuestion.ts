import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";

type IRes = {
    nextLever: number;
    nextQuestion: ICurrentGame;
    isFirst: boolean;
};
const nextQuestionThunk = createAsyncThunk(
    "nextQuestionThunk",
    async (_, thunkAPI): Promise<IRes | undefined> => {
        const state = thunkAPI.getState() as RootState;
        const {
            listQuestion,
            incorrectQuestionIds,
            isFirstAttempt,
            currentQuestionIndex,
        } = state.gameReducer;

        if (isFirstAttempt && currentQuestionIndex + 1 < listQuestion.length) {
            return {
                nextLever: currentQuestionIndex + 1,
                nextQuestion: listQuestion[currentQuestionIndex + 1],
                isFirst: true,
            };
        }

        if (incorrectQuestionIds.length > 0) {
            const idQuestionInCorrect = incorrectQuestionIds[0];

            const indexQuestion = listQuestion.findIndex(
                (item) => item.id === idQuestionInCorrect
            );

            return {
                nextLever: indexQuestion,
                nextQuestion: {
                    ...listQuestion[indexQuestion],
                    selectedAnswer: null,
                    localStatus: "new",
                },
                isFirst: false,
            };
        }
        return undefined;
    }
);

export default nextQuestionThunk;
