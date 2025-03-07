import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@ui/db';
import { IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import { axiosRequest } from '@ui/services/config/axios';
import {
  getLocalUserProgress,
  mapQuestionsWithProgress,
} from './initPracticeTest';

const updateDB = async (id: number) => {
  db?.testQuestions.update(id, {
    isGamePaused: false,
    startTime: Date.now(),
  });
};
const initFinalTestThunk = createAsyncThunk(
  'initFinalTestThunk',
  async ({ id }: { id: number }, thunkAPI) => {
    // const state = thunkAPI.getState() as RootState;
    // let { isDataFetched } = state.appInfo;

    // while (!isDataFetched) {
    //   await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
    //   isDataFetched = (thunkAPI.getState() as RootState).appInfo.isDataFetched;
    // }

    const dataStore = await db?.testQuestions.get(id);

    if (dataStore) {
      const listIds =
        dataStore.groupExamData?.flatMap((item) => item.questionIds) || [];

      const questionsDb = await db?.questions
        .where('id')
        .anyOf(listIds)
        .toArray();

      const progressData = await getLocalUserProgress(
        listIds,
        'finalTests',
        dataStore.attemptNumber,
        dataStore.id
      );

      if (progressData && questionsDb) {
        const questions = mapQuestionsWithProgress(
          questionsDb,
          progressData
        ) as IQuestionOpt[];
        await updateDB(dataStore.id);
        const remainingTime =
          dataStore.totalDuration * 60 - (dataStore?.elapsedTime || 0);

        return {
          questions,
          progressData,
          attemptNumber: dataStore.attemptNumber,
          currentTopicId: dataStore.id,
          gameMode: 'finalTests' as IGameMode,
          totalDuration: dataStore.totalDuration,
          isGamePaused: dataStore?.isGamePaused || false,
          remainingTime: remainingTime,
        };
      }
      return undefined;
    } else {
      const data = await axiosRequest({
        url: `asvab/web-data/exam-4886547081986048.json`,
        method: 'get',
        baseUrl:
          'https://storage.googleapis.com/micro-enigma-235001.appspot.com/',
      });

      return {
        questions: data.data as IQuestionOpt[],
        progressData: [],
        currentTopicId: 4886547081986048,
        gameMode: 'finalTests' as IGameMode,
        totalDuration: 150,
        isGamePaused: false,
        remainingTime: 150 * 60,
      };
    }
  }
);

export default initFinalTestThunk;
