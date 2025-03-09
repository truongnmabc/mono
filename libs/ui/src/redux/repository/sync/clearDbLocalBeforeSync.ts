import { db } from '@ui/db';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TypeParam } from '@ui/constants';

export const clearDbLocalBeforeSync = createAsyncThunk(
  'clearDbLocalBeforeSync',
  async () => {
    await db?.userProgress.clear();
    await db?.useActions.clear();
    await db?.testQuestions
      .where('gameMode')
      .equals(TypeParam.diagnosticTest)
      .delete();
    await db?.testQuestions
      .where('gameMode')
      .equals(TypeParam.customTests)
      .delete();
    return true;
  }
);
