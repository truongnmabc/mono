import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestionOpt } from "@/models/question";
import { IGameMode } from "@/models/tests";
import { RootState } from "@/redux/store";

export const handleInitTestQuestion = (
    state: RootState["gameReducer"],
    payload: {
        progressData: IUserQuestionProgress[];
        questions: IQuestionOpt[];
        gameMode: IGameMode;
        currentTopicId: number;
        totalDuration: number;
        isGamePaused: boolean;
        remainingTime: number;
        attemptNumber?: number;
    }
) => {
    const {
        progressData,
        questions,
        gameMode,
        currentTopicId,
        totalDuration,
        isGamePaused,
        remainingTime,
        attemptNumber,
    } = payload;

    state.totalDuration = totalDuration;
    state.gameMode = gameMode;
    if (attemptNumber) state.attemptNumber = attemptNumber;
    state.currentTopicId = currentTopicId ?? -1;
    state.listQuestion = questions;
    state.isFirstAttempt = true;
    state.isGamePaused = isGamePaused;
    state.remainingTime = remainingTime;

    if (!progressData || progressData.length === 0) {
        state.currentQuestionIndex = 0;
        state.currentGame = questions[0];
    } else {
        const firstUnansweredIndex = questions.findIndex(
            (question) =>
                !progressData.some((answer) => answer?.id === question?.id)
        );

        state.currentQuestionIndex =
            firstUnansweredIndex > 0 ? firstUnansweredIndex : 0;

        state.currentGame = {
            ...questions[firstUnansweredIndex],
            localStatus: "new",
            selectedAnswer: null,
        };
    }
};
