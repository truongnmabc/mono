import { createAsyncThunk } from '@reduxjs/toolkit';
import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
import { RootState } from '@ui/redux/store';

export const shouldNextOrPreviousQuestion = createAsyncThunk(
  'shouldNextOrPreviousQuestion',
  async (payload: 'prev' | 'next', thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { currentQuestionIndex, listQuestion, currentGame } = state.game;
    const { userInfo } = state.user;
    const listLength = listQuestion.length;

    if (!userInfo.isPro && currentQuestionIndex > 48) {
      return {
        isUnLock: true,
        index: 48,
      };
    }
    if (currentQuestionIndex + 1 >= listLength) {
      thunkAPI.dispatch(shouldOpenSubmitTest(true));
      return;
    }

    return {
      index:
        payload === 'prev'
          ? currentQuestionIndex - 1
          : currentQuestionIndex + 1,
    };
  }
);
