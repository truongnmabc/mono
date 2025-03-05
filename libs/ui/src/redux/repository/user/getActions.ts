import { db } from '@ui/db';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface IUserActions {
  ids: number[];
}

const getListActionThunk = createAsyncThunk(
  'getListActionThunk',
  async ({ ids }: IUserActions) => {
    const existingAction = await db?.useActions
      .where('questionId')
      .anyOf(ids)
      .toArray();

    return { list: existingAction || [] };
  }
);

export default getListActionThunk;
