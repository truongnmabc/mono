import { db } from '@ui/db';
import { ITestBase } from '@ui/models/tests';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLocalUserProgress } from '../initData/initPracticeTest';
import { IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';

interface IProps extends ITestBase {
  indexSubTopic: number;
}
const choiceStartCustomTestThunk = createAsyncThunk(
  'startCustomTest',
  async ({ item }: { item: IProps }) => {
    const listIds = item?.groupExamData.flatMap((item) => item.questionIds);
    const progressData = await getLocalUserProgress(
      listIds,
      'customTets',
      item.attemptNumber
    );

    const questions =
      (await db?.questions.where('id').anyOf(listIds).toArray()) ||
      ([] as IQuestionOpt[]);

    if (progressData) {
      return {
        questions,
        progressData,
        currentTopicId: item.id,
        gameMode: 'practiceTests' as IGameMode,
        totalDuration: item.totalDuration,
        isGamePaused: false,
        remainingTime: item?.remainingTime || item.totalDuration * 60,
        currentSubTopicIndex: item.indexSubTopic,
        gameDifficultyLevel: item.gameDifficultyLevel,
      };
    }
    return undefined;
  }
);

export default choiceStartCustomTestThunk;
