import { createAsyncThunk } from '@reduxjs/toolkit';
import { TypeParam } from '@ui/constants';
import { db } from '@ui/db';
import { IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import { RootState } from '@ui/redux/store';
import { totalPassingPart } from '@ui/utils/calculate';
import {
  getLocalUserProgress,
  mapQuestionsWithProgress,
} from '../../utils/handle';

const getDataResultTestThunk = createAsyncThunk(
  'getDataResultTestThunk',
  async (
    { gameMode, resultId }: { gameMode: IGameMode; resultId: number },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;
    let { isDataFetched } = state.appInfo;
    const passPercent = state.game.passingThreshold;
    const { userInfo } = state.user;
    while (!isDataFetched) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      isDataFetched = (thunkAPI.getState() as RootState).appInfo.isDataFetched;
    }

    if (gameMode === 'review') {
      const { passingThreshold, listQuestion } = state.game;

      const listTopicIds = [...new Set(listQuestion.map((q) => q.topicId))];
      const listQuestionIds = [...new Set(listQuestion.map((q) => q.id))];

      const progressData =
        (await getLocalUserProgress(listQuestionIds, gameMode, 1, resultId)) ||
        [];
      const questions = mapQuestionsWithProgress(
        listQuestion || [],
        progressData
      ) as IQuestionOpt[];
      const incorrectQuestions = questions.filter(
        (q) => q.selectedAnswer?.correct === false || !q.selectedAnswer
      );
      const correctQuestions = questions.filter(
        (q) => q.selectedAnswer?.correct === true
      );

      const passingAppInfo = await db?.passingApp.get(-1);
      const passingPart = await totalPassingPart({
        progress: progressData,
        averageLevel: passingAppInfo?.averageLevel || 50,
        turn: 1,
      });
      const passing =
        (passingPart / (passingAppInfo?.totalQuestion || 1800)) * 100;
      const isPass =
        (correctQuestions.length / questions.length) * 100 >
        (passingThreshold || 70);
      return {
        incorrectQuestions,
        correctQuestions,
        questions,
        listTopic: [],
        passing,
        isPass,
      };
    }
    const tests = await db?.testQuestions?.get(resultId);
    const questionIds =
      tests?.groupExamData?.flatMap((item) => item.questionIds) || [];

    const [passingAppInfo, questionsDb] = await Promise.all([
      db?.passingApp.get(-1),
      db?.questions.where('id').anyOf(questionIds).toArray(),
    ]);

    const progressData =
      (await getLocalUserProgress(
        questionIds,
        gameMode,
        tests?.attemptNumber || 1,
        resultId
      )) || [];

    const data = mapQuestionsWithProgress(
      questionsDb || [],
      progressData
    ) as IQuestionOpt[];
    const questions =
      !userInfo.isPro && gameMode === TypeParam.finalTests
        ? data.slice(0, 50)
        : data;
    console.log('🚀 ~ questions:', questions);
    const incorrectQuestions = questions.filter(
      (q) => q.selectedAnswer?.correct === false || !q.selectedAnswer
    );
    console.log('🚀 ~ incorrectQuestions:', incorrectQuestions);
    const correctQuestions = questions.filter(
      (q) => q.selectedAnswer?.correct === true
    );
    const passingPart = await totalPassingPart({
      progress: progressData,
      averageLevel: passingAppInfo?.averageLevel || 50,
      turn: tests?.attemptNumber || 1,
    });
    const passing =
      (passingPart / (passingAppInfo?.totalQuestion || 1800)) * 100;

    const listTopic = tests?.topicIds?.map((id) => {
      return {
        id,
        totalQuestion:
          tests.groupExamData.find((t) => t.topicId === id)?.totalQuestion || 0,
        correct: correctQuestions.filter((t) => t.topicId === id),
      };
    });
    const isPass =
      (correctQuestions.length / questions.length) * 100 > (passPercent || 70);

    return {
      incorrectQuestions,
      correctQuestions,
      questions,
      listTopic,
      passing,
      isPass,
    };
  }
);

export default getDataResultTestThunk;
