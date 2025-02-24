import { db } from '@ui/db';
import { RootState } from '@ui/redux/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IGameMode } from '@ui/models/tests/tests';

const resumedTestThunk = createAsyncThunk(
  'resumedTestThunk',
  async ({ type }: { type: IGameMode }) => {
    await db?.testQuestions
      .where('gameMode')
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
  'updateTimeTest',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { currentTopicId } = state.game;
    await db?.testQuestions
      .where('id')
      .equals(currentTopicId)
      .modify((item) => {
        item.startTime = Date.now();
      });
  }
);
