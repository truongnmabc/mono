import { createAsyncThunk } from '@reduxjs/toolkit';
import { IGameMode } from '@ui/models/tests/tests';

import { RootState } from '@ui/redux/store';

const choiceUnAnswerDiagnostic = createAsyncThunk(
  'choiceUnAnswerDiagnostic',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { currentQuestionIndex, listQuestion, currentGame } = state.game;

    if (currentQuestionIndex + 1 === listQuestion.length) {
      return {
        isCompleted: true,
        resultId: 1,
        currentSubTopicIndex: '1',
        attemptNumber: 1,
      };
    } else {
      const choice = {
        correct: false,
        explanation: '',
        id: -1,
        index: -1,
        text: '',
        turn: 1,
        type: 'diagnosticTest' as IGameMode,
        parentId: -1,
      };
      return {
        choice,
        question: currentGame,
      };
    }
  }
);

export default choiceUnAnswerDiagnostic;
