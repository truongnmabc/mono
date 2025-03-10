import { createAsyncThunk } from '@reduxjs/toolkit';

import { IResponseSyncDown } from '@ui/models/sync';

import { RootState } from '@ui/redux/store';
import { getAllUserDataFromServer } from '@ui/services/sync';
import {
  convertTopicsFromServer,
  handleConvertQuestions,
  handleCreateNewTest,
  handleReaction,
} from './utils';
import { db } from '@ui/db';
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
        deleteOldData: true,
        user_data: {
          userId: userInfo.email,
          syncKey: syncKey,
          appId: appInfo.appId,
          deviceId: userInfo.email,
          probabilityOfPassing: 0.0,
          mapUpdateData: {},
          TopicProgress: [],
          QuestionProgress: [],
          UserQuestionProgress: [],
          StudyPlan: [],
          DailyGoal: [],
          TestInfo: [],
          UserTestData: [],
        },
      })) as unknown as IResponseSyncDown;

      if (data) {
        console.log('🚀 ~ data:', data);
        const {
          UserQuestionProgress,
          TestInfo,
          QuestionProgress,
          TopicProgress,
          UserTestData,
        } = data;

        await Promise.all([
          convertTopicsFromServer({
            topicsSync: TopicProgress || [],
          }),
          handleReaction(QuestionProgress),
          handleCreateNewTest({
            TestInfo,
            UserTestData,
          }),
          handleConvertQuestions(UserQuestionProgress),
        ]);
      }
    } catch (err) {
      console.log('🚀 ~ err:', err);
    }
  }
);
