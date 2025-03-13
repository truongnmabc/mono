import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@ui/db';
import { ITopicBase } from '@ui/models';
import { IGameMode } from '@ui/models/tests/tests';
import { RootState } from '@ui/redux/store';
import { syncUp } from '../../sync/syncUp';
type ActionResponse = {
  turn?: number;
  resultId?: number;
  gameMode?: IGameMode;
};
const submitTestThunk = createAsyncThunk(
  'submitTestThunk',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { currentTopicId, gameMode } = state.game;
    const data = {
      status: 1,
      isGamePaused: false,
    };
    const actions: Record<string, () => Promise<ActionResponse>> = {
      learn: async () => await saveDataDbLearn({ currentTopicId }),
      practiceTests: async () => await saveDataDb(currentTopicId, data),
      diagnosticTest: async () => await saveDataDb(currentTopicId, data),
      finalTests: async () => await saveDataDb(currentTopicId, data),
      branchTest: async () => await saveDataDb(currentTopicId, data),
      customTests: async () => await saveDataDb(currentTopicId, data),
      review: async () => {
        return {
          resultId: currentTopicId,
          attemptNumber: 1,
        };
      },
    } as const;
    const action = actions[gameMode];
    const { turn: attemptNumber, resultId } = await action();
    const { userInfo } = state.user;
    if (userInfo.email) {
      thunkAPI.dispatch(syncUp({}));
    }
    return {
      attemptNumber,
      resultId,
      gameMode,
    };
  }
);

export default submitTestThunk;
type IData = { status: number; isGamePaused: boolean };
const saveDataDb = async (id: number, data: IData) => {
  const dataDb = await db?.testQuestions.get(id);
  if (dataDb) {
    await db?.testQuestions.update(id, data);
  }
  return {
    attemptNumber: dataDb?.attemptNumber,
    resultId: dataDb?.id,
  };
};

export const saveDataDbLearn = async ({
  currentTopics,
  currentTopicId,
}: {
  currentTopics?: ITopicBase;
  currentTopicId?: number;
}) => {
  let topic = currentTopics;

  if (!currentTopics && currentTopicId) {
    topic = await db?.topics.get(currentTopicId);
  }
  await db?.topics.update(topic?.id, {
    status: 1,
  });

  const listTopic = await db?.topics
    .where('parentId')
    .equals(topic?.parentId || -1)
    .toArray();

  const isNot = listTopic?.find((i) => i.status === 0);
  console.log('🚀 ~ saveDataDbLearn ~ isNot:', isNot);
  if (!isNot) {
    const sub = await db?.topics.get(topic?.parentId);
    await db?.topics.update(topic?.parentId, {
      status: 1,
    });

    const listSub = await db?.topics
      .where('parentId')
      .equals(sub?.parentId || -1)
      .toArray();
    const isNot = listSub?.find((i) => i.status === 0);
    if (!isNot) {
      await db?.topics.update(sub?.parentId, {
        status: 1,
      });
    }
  }
  return {
    currentQuestionIndex: Number(topic?.index),
    attemptNumber: topic?.turn,
    resultId: topic?.id,
  };
};
