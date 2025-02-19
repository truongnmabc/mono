"use client";
import { ICurrentGame } from "@/models/game/game";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import choiceAnswer, {
    processChoiceAnswer,
} from "../repository/game/choiceAnswer/choiceAnswer";
import choiceStartCustomTestThunk from "../repository/game/choiceAnswer/choiceStartTest";
import initCustomTestThunk from "../repository/game/initData/initCustomTest";
import initDiagnosticTestQuestionThunk from "../repository/game/initData/initDiagnosticTest";
import initFinalTestThunk from "../repository/game/initData/initFinalTest";
import initLearnQuestionThunk, {
    handleInitLearnQuestion,
} from "../repository/game/initData/initLearningQuestion";
import initPracticeThunk from "../repository/game/initData/initPracticeTest";
import nextQuestionThunk from "../repository/game/nextQuestion/nextQuestion";
import nextQuestionDiagnosticThunk from "../repository/game/nextQuestion/nextQuestionDiagnosticTest";
import { handleInitTestQuestion } from "../repository/game/utils";
import { reloadStateThunk } from "../repository/utils/reload";
import { RootState } from "../store";
import { initGameReducer, plateHolderCurrentGame } from "./game.placeholder";
import { IGameMode } from "@/models/tests";

export const gameSlice = createSlice({
    name: "game",
    initialState: initGameReducer,
    reducers: {
        setCurrentGame: (state, action: PayloadAction<ICurrentGame>) => {
            state.currentGame = action.payload;
        },
        setCurrentQuestion: (state, action) => {
            const payload = action.payload;
            const index = payload === state.listQuestion?.length ? 0 : payload;
            state.currentQuestionIndex = index;
            state.currentGame = state.listQuestion[index];
        },
        setIndexSubTopic: (state, action) => {
            state.currentSubTopicIndex = action.payload;
        },
        setListQuestionGames: (
            state,
            action: PayloadAction<ICurrentGame[]>
        ) => {
            state.listQuestion = action.payload;
        },
        setTurtGame: (
            state,
            action: PayloadAction<{
                turn: number;
            }>
        ) => {
            state.attemptNumber = action.payload.turn;
        },
        setShouldListenKeyboard: (state, action) => {
            state.enableKeyboardShortcuts = action.payload;
        },
        startOverGame: (state) => {
            const list = [...state.listQuestion]?.map((item) => ({
                ...item,
                localStatus: "new" as const,
                selectedAnswer: null,
            }));

            state.currentGame = list[0];
            state.listQuestion = list;
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isGamePaused = false;
            state.remainingTime = state.totalDuration * 60;
        },
        startTryAgainDiagnostic: (state) => {
            state.hasRetakenDiagnosticTest = true;
        },
        continueGame: (state) => {
            state.isGamePaused = false;
        },
        shouldEndTimeTest: (state, action) => {
            state.isTimeUp = action.payload;
        },
        endTest: (state) => {
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isGamePaused = false;
            state.remainingTime = -1;
        },
        shouldLoading: (state) => {
            state.shouldLoading = !state.shouldLoading;
        },
        setCurrentTopicId: (state, action) => {
            state.currentTopicId = action.payload;
        },
        shouldCreateNewTest: (state, action) => {
            state.isCreateNewTest = action.payload;
        },
        startCustomTest: (state, action) => {
            const {
                listQuestion,
                remainingTime,
                parentId,
                gameDifficultyLevel,
                passingThreshold,
                currentSubTopicIndex,
            } = action.payload;

            state.listQuestion = listQuestion;
            state.currentGame = listQuestion[0];
            state.currentTopicId = parentId;
            state.remainingTime = remainingTime;
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isFirstAttempt = true;
            state.gameDifficultyLevel = gameDifficultyLevel;
            state.passingThreshold = passingThreshold;
            state.currentSubTopicIndex = currentSubTopicIndex;
        },

        updateFeedbackCustomTest: (state, action) => {
            const { gameDifficultyLevel } = action.payload;
            state.gameDifficultyLevel = gameDifficultyLevel;
        },

        resetState: () => {
            return initGameReducer;
        },
        startRandomReview: (state, action) => {
            const { listQuestion } = action.payload;
            state.listQuestion = listQuestion;
            state.currentGame = listQuestion[0];
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isFirstAttempt = true;
        },
    },
    extraReducers(builder) {
        builder.addCase(
            nextQuestionDiagnosticThunk.fulfilled,
            (state, action) => {
                if (action.payload) {
                    const { nextLever, listQuestion, indexCurrentQuestion } =
                        action.payload;

                    state.listQuestion = listQuestion;
                    state.currentGame = nextLever;
                    state.currentQuestionIndex = indexCurrentQuestion;
                    state.remainingTime = 80;
                }
            }
        );

        builder.addCase(reloadStateThunk.fulfilled, (state, action) => {
            const { attemptNumber } = action.payload;
            state.attemptNumber = attemptNumber;
        });

        builder.addCase(nextQuestionThunk.fulfilled, (state, action) => {
            const data = action.payload;
            state.currentGame = data?.nextQuestion ?? state.listQuestion[0];
            state.isFirstAttempt = data?.isFirst ?? true;
            state.currentQuestionIndex = data?.nextLever ?? 0;
        });

        builder.addCase(choiceAnswer.fulfilled, (state, action) => {
            if (action.payload) {
                processChoiceAnswer(state, action.payload);
            }
        });

        builder.addCase(initPracticeThunk.fulfilled, (state, action) => {
            state.gameMode = "practiceTests";
            if (action.payload) {
                handleInitTestQuestion(state, {
                    ...action.payload,
                    questions: action.payload.questions || [],
                });
            }
        });

        builder.addCase(initLearnQuestionThunk.fulfilled, (state, action) => {
            if (action.payload) {
                handleInitLearnQuestion(state, action.payload);
            }
        });

        builder.addCase(initFinalTestThunk.fulfilled, (state, action) => {
            state.gameMode = "finalTests";

            if (action.payload) {
                handleInitTestQuestion(state, action.payload);
            }
        });

        builder.addCase(
            choiceStartCustomTestThunk.fulfilled,
            (state, action) => {
                state.gameMode = "customTets";
                if (action.payload) {
                    state.currentSubTopicIndex =
                        action.payload.currentSubTopicIndex;
                    handleInitTestQuestion(state, action.payload);
                }
            }
        );

        builder.addCase(initCustomTestThunk.fulfilled, (state, action) => {
            if (action.payload) {
                const data = {
                    ...action.payload,
                    remainingTime: action.payload.remainingTime || 0,
                    questions: action.payload.questions || [],
                    gameMode: action.payload.gameMode as IGameMode,
                };
                handleInitTestQuestion(state, {
                    ...data,
                });
                const {
                    passingThreshold,
                    attemptNumber,
                    gameDifficultyLevel,
                    currentSubTopicIndex,
                } = action.payload;
                state.currentSubTopicIndex = currentSubTopicIndex;
                state.passingThreshold = passingThreshold;
                state.attemptNumber = attemptNumber;
                state.gameDifficultyLevel = gameDifficultyLevel;
            } else {
                state.listQuestion = [];
                state.currentGame = plateHolderCurrentGame;
                state.isGamePaused = false;
                state.gameMode = "customTets";
            }
            state.isDataLoaded = true;
        });

        builder.addCase(
            initDiagnosticTestQuestionThunk.fulfilled,
            (state, action) => {
                if (action.payload) {
                    const {
                        listQuestion,
                        isGamePaused,
                        currentTopicId,
                        progressData,
                        attemptNumber,
                    } = action.payload;

                    handleInitTestQuestion(state, {
                        gameMode: "diagnosticTest",
                        progressData: progressData || [],
                        questions: listQuestion,
                        currentTopicId: currentTopicId,
                        totalDuration: 1,
                        isGamePaused: isGamePaused,
                        remainingTime: 80,
                        attemptNumber,
                    });
                }
            }
        );
    },
});

const { reducer: gameReducer, actions } = gameSlice;

export const {
    setCurrentGame,
    setListQuestionGames,
    setShouldListenKeyboard,
    setTurtGame,
    startOverGame,
    continueGame,
    shouldCreateNewTest,
    endTest,
    startCustomTest,
    resetState,
    setIndexSubTopic,
    setCurrentQuestion,
    startRandomReview,
    startTryAgainDiagnostic,
    shouldEndTimeTest,
    setCurrentTopicId,
    shouldLoading,
    updateFeedbackCustomTest,
} = actions;

export const gameState = (state: RootState) => state.gameReducer;

export default gameReducer;
