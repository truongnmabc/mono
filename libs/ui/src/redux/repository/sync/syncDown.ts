import { createAsyncThunk } from '@reduxjs/toolkit';

import { TestConstType } from '@ui/constants';
import { IAppInfo, IUserInfo } from '@ui/models';
import { IResponseSyncDown } from '@ui/models/sync';
import { RootState } from '@ui/redux/store';
import { getAllUserDataFromServer } from '@ui/services/sync';
import { clearDbLocalBeforeSync } from './clearDbLocalBeforeSync';
import {
  convertTopicsFromServer,
  handleConvertQuestions,
  handleCreateNewTest,
  handleReaction,
} from './utils';

interface IProps {
  syncKey: string;
  deleteOldData?: boolean;
  db?: 'server' | 'local';
}

export const syncDown = createAsyncThunk(
  'syncDown',
  async (
    { syncKey, deleteOldData = false, db = 'server' }: IProps,
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;
    const { appInfo } = state.appInfo;
    const { userInfo } = state.user;
    if (db === 'local') {
      // sync len
    } else {
      // sync xuong
      handleSyncDown({
        appInfo,
        userInfo,
        syncKey,
        deleteOldData,
        db,
      });
    }
  }
);

interface IPropsSyncDown extends IProps {
  appInfo: IAppInfo;
  userInfo: IUserInfo;
}
const handleSyncDown = async ({
  appInfo,
  userInfo,
  syncKey,
  deleteOldData = false,
}: IPropsSyncDown) => {
  try {
    const data = (await getAllUserDataFromServer({
      appId: appInfo.appId,
      userId: userInfo.email,
      deleteOldData: false,
      user_data: {
        userId: userInfo.email,
        syncKey: syncKey,
        appId: appInfo.appId,
        deviceId: userInfo.email,
        mapUpdateData: {},
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
      if (deleteOldData) {
        const isTest = TestInfo.find(
          (item) => item.type === TestConstType.diagnosticTest
        );
        await clearDbLocalBeforeSync({
          isClearDianosticTest: !!isTest,
        });
      }
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
};
