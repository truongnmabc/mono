import { createAsyncThunk } from '@reduxjs/toolkit';

import { IResponseSyncDown } from '@ui/models/sync';

import { RootState } from '@ui/redux/store';
import { getAllUserDataFromServer } from '@ui/services/sync';
import {
  converTopicsFromServer,
  handleConvertQuestions,
  handleCreateNewTest,
  handleReaction,
} from './utils';
export const syncDown = createAsyncThunk(
  'syncDown',
  async (
    {
      syncKey,
    }: {
      syncKey: string;
    },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;
    const { appInfo } = state.appInfo;
    const { userInfo } = state.user;
    try {
      const data = (await getAllUserDataFromServer({
        appId: appInfo.appId,
        userId: userInfo.email,
        deleteOldData: false,
      })) as unknown as IResponseSyncDown;

      if (data) {
        const {
          UserQuestionProgress,
          TestInfo,
          QuestionProgress,
          TopicProgress,
          UserTestData,
        } = data;

        await Promise.all([
          converTopicsFromServer({
            topicsSync: TopicProgress || [],
          }),
          handleReaction(QuestionProgress),
          handleCreateNewTest(TestInfo, UserTestData),
          handleConvertQuestions(UserQuestionProgress),
        ]);
      }
    } catch (err) {
      console.log('🚀 ~ err:', err);
    }
  }
);
