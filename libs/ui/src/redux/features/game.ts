import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICurrentGame } from '@ui/models/game';
import choiceAnswer, {
  processChoiceAnswer,
} from '../repository/game/choiceAnswer/choiceAnswer';
import initDataGame from '../repository/game/initData/initData';

import { handleMigrateDataGame } from '../repository/game/utils';
import { reloadStateThunk } from '../repository/utils/reload';
import { RootState } from '../store';
import { initGameReducer, plateHolderCurrentGame } from './game.placeholder';
import nextQuestionActionThunk from '../repository/game/nextQuestion/nextGame';
import choiceUnAnswerDiagnostic from '../repository/game/choiceAnswer/choiceAnswerDiagnostic';
import { shouldNextOrPreviousQuestion } from '../repository/game/nextQuestion/nextQuestions';
import { TypeParam } from '@ui/constants';
const gameSlice = createSlice({
  name: 'game',
  initialState: initGameReducer,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<ICurrentGame>) => {
      state.currentGame = action.payload;
    },

    setIndexSubTopic: (state, action) => {
      state.currentSubTopicIndex = action.payload;
    },
    setListQuestionGames: (state, action: PayloadAction<ICurrentGame[]>) => {
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

    startOverGame: (state) => {
      const list = [...state.listQuestion]?.map((item) => ({
        ...item,
        localStatus: 'new' as const,
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

    setCurrentTopicId: (state, action) => {
      state.currentTopicId = action.payload;
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

    // DONE
    setShouldListenKeyboard: (state, action) => {
      state.enableKeyboardShortcuts = action.payload;
    },
    resetState: () => {
      return initGameReducer;
    },
    startRandomReview: (state, action) => {
      const { listQuestion, id } = action.payload;
      state.listQuestion = listQuestion;
      state.currentGame = listQuestion[0];
      state.currentQuestionIndex = 0;
      state.attemptNumber = 1;
      state.isFirstAttempt = true;
      state.gameMode = 'review';
      state.currentTopicId = id;
    },
    updateFeedbackCustomTest: (state, action) => {
      const { gameDifficultyLevel } = action.payload;
      state.gameDifficultyLevel = gameDifficultyLevel;
    },

    setCurrentQuestion: (state, action) => {
      const payload = action.payload;
      const index = payload === state.listQuestion?.length ? 0 : payload;
      state.currentQuestionIndex = index;
      state.currentGame = state.listQuestion[index];
    },
  },
  extraReducers(builder) {
    builder.addCase(reloadStateThunk.fulfilled, (state, action) => {
      const { attemptNumber } = action.payload;
      state.attemptNumber = attemptNumber;
    });

    // DONE

    builder.addCase(shouldNextOrPreviousQuestion.fulfilled, (state, action) => {
      if (action.payload) {
        const { index } = action.payload;
        state.currentQuestionIndex = index;
        state.currentGame = state.listQuestion[index];
      }
    });

    builder.addCase(initDataGame.fulfilled, (state, action) => {
      if (action.payload && !action.payload.isCompleted) {
        handleMigrateDataGame(state, action.payload);
      }
    });

    builder.addCase(nextQuestionActionThunk.fulfilled, (state, action) => {
      if (action.payload) {
        handleMigrateDataGame(state, action.payload);
      }
    });

    builder.addCase(choiceAnswer.fulfilled, (state, action) => {
      if (action.payload) {
        processChoiceAnswer(state, action.payload);
      }
    });

    builder.addCase(choiceUnAnswerDiagnostic.fulfilled, (state, action) => {
      if (
        !action.payload?.isCompleted &&
        action.payload?.choice &&
        action.payload?.question
      ) {
        processChoiceAnswer(state, {
          choice: action.payload.choice,
          question: action.payload.question,
        });
      }
    });
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
  endTest,
  startCustomTest,
  resetState,
  setIndexSubTopic,
  setCurrentQuestion,
  startRandomReview,
  startTryAgainDiagnostic,
  shouldEndTimeTest,
  setCurrentTopicId,
  updateFeedbackCustomTest,
} = actions;

export const gameState = (state: RootState) => state.game;
export default gameReducer;
