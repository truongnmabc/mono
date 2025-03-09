import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@ui/db';
import { IGameMode } from '@ui/models/tests/tests';
import { RootState } from '@ui/redux/store';
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
      learn: async () => await saveDataDbLearn(currentTopicId),
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

export const saveDataDbLearn = async (id: number) => {
  const currentTopics = await db?.topics.get(id);
  if (currentTopics) {
    await db?.topics
      .where('id')
      .equals(id)
      .modify((topic) => {
        topic.status = 1;
      });
  }
  return {
    currentQuestionIndex: Number(currentTopics?.index),
    attemptNumber: currentTopics?.turn,
    resultId: currentTopics?.id,
  };
};
