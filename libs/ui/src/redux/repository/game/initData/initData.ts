import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionBase, IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import { setIsStartAnimationNext } from '@ui/redux/features/appInfo';
import { selectTopics } from '@ui/redux/features/study';
import { RootState } from '@ui/redux/store';
import selectSubTopicThunk from '../../study/select';
import { getNextQuestionState, getQuestionProgress } from './utils/calculate';
import { handleGetDataCustom } from './utils/custom';
import { handleGetDataDiagnosticTest } from './utils/diagnostic';
import { handleGetDataFinalTest } from './utils/final';
import { handleGetDataLean } from './utils/learn';
import { handleGetDataPracticeTest } from './utils/practice';
import { handleGetDataReview } from './utils/review';
import { TypeParam } from '@ui/constants';
import { db } from '@ui/db';
import { shouldOpenSetting } from '@ui/redux/features/tests';
import { IFeedBack } from '@ui/models/game';

type IInitQuestion = {
  subTopicTag?: string;
  partTag?: string;
  partId?: number;
  subTopicId?: number;
  isReset?: boolean;
  turn?: number;
  type: IGameMode;
  slug?: string;
  testId?: number;
  topicId?: number;
  isCreate?: boolean;
};
interface IResInitQuestion {
  resultId?: number;
  progressData?: IUserQuestionProgress[];
  questions?: IQuestionOpt[];
  gameMode?: IGameMode;
  timeStart?: number;
  currentTopicId?: number;
  totalDuration?: number;
  isGamePaused?: boolean;
  remainingTime?: number;
  attemptNumber?: number;
  currentSubTopicIndex?: number;
  isCompleted?: boolean;
  currentQuestionIndex?: number;
  currentGame?: IQuestionOpt;
  isFirstAttempt?: boolean;
  incorrectQuestionIds?: number[];
  listQuestion?: IQuestionOpt[];
  passingThreshold?: number;
  index?: string;
  gameDifficultyLevel?: IFeedBack;
}

type IResInitDataGame = {
  listQuestions?: IQuestionBase[];
  attemptNumber?: number;
  index?: string;
  parentId?: number;
  isGamePaused?: boolean;
  subTopicId?: number;
  isCompleted?: boolean;
  isFirstAttempt?: boolean;
  id?: number;
  passingThreshold?: number;
  totalDuration?: number;
  remainingTime?: number;
  currentSubTopicIndex?: number;
  shouldOpenSettingCustomTest?: boolean;
  gameDifficultyLevel?: IFeedBack;
};

const initDataGame = createAsyncThunk(
  'initDataGame',
  async (params: IInitQuestion, thunkAPI): Promise<IResInitQuestion> => {
    const { partId, type, slug, turn, topicId, testId, isCreate } = params;
    const state = thunkAPI.getState() as RootState;

    let { isDataFetched } = state.appInfo;
    while (!isDataFetched) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      isDataFetched = (thunkAPI.getState() as RootState).appInfo.isDataFetched;
    }
    if (isCreate) {
      thunkAPI.dispatch(
        shouldOpenSetting({
          openModalSetting: true,
          isListEmpty: true,
        })
      );
      return {};
    }

    const modeHandlers: Record<IGameMode, () => Promise<IResInitDataGame>> = {
      learn: async () => await handleGetDataLean({ partId, slug }),
      diagnosticTest: async () => await handleGetDataDiagnosticTest({ testId }),
      finalTests: async () => await handleGetDataFinalTest({ testId }),
      branchTest: async () =>
        await handleGetDataPracticeTest({
          testId,
          type: TypeParam.branchTest,
        }),
      practiceTests: async () =>
        await handleGetDataPracticeTest({
          testId,
          type: TypeParam.practiceTests,
        }),
      customTests: async () =>
        await handleGetDataCustom({
          testId,
          type: TypeParam.customTests,
        }),
      review: async () => await handleGetDataReview({ testId, type: 'review' }),
    };

    const result = await (modeHandlers[type] || modeHandlers.learn)();

    const {
      listQuestions,
      id,
      subTopicId,
      attemptNumber,
      isCompleted,
      passingThreshold,
      isGamePaused,
      totalDuration,
      remainingTime,
      currentSubTopicIndex,
      index,
      shouldOpenSettingCustomTest,
      gameDifficultyLevel,
    } = result;

    if (shouldOpenSettingCustomTest) {
      thunkAPI.dispatch(
        shouldOpenSetting({
          openModalSetting: true,
          isListEmpty: true,
        })
      );
      return {};
    }

    if (isCompleted) {
      thunkAPI.dispatch(setIsStartAnimationNext(true));

      return {
        isCompleted: true,
        resultId: id,
        index: index,
        attemptNumber,
      };
    }

    const { questions, progressData } = await getQuestionProgress(
      type,
      id,
      listQuestions,
      attemptNumber || turn || 1
    );

    if (
      type === TypeParam.learn &&
      questions.length === progressData.length &&
      progressData.every((i) => i.selectedAnswers.some((i) => i.correct))
    ) {
      // Làm tới câu cuối nhưng không submit và reload lại page
      thunkAPI.dispatch(setIsStartAnimationNext(true));
      if (type !== TypeParam.learn) {
        await db?.topics
          .where('id')
          .equals(id || -1)
          .modify((item) => {
            item.status = 1;
          });
      }
      if (type === TypeParam.learn) {
        await db?.testQuestions
          .where('id')
          .equals(id || -1)
          .modify((item) => {
            item.status = 1;
          });
      }
      return {
        isCompleted: true,
        resultId: id,
        index: index,
        attemptNumber,
      };
    }

    const {
      currentGame,
      currentQuestionIndex,
      incorrectQuestionIds,
      isFirstAttempt,
    } = getNextQuestionState(questions, progressData);

    if (topicId) thunkAPI.dispatch(selectTopics(topicId));
    if (subTopicId) thunkAPI.dispatch(selectSubTopicThunk(subTopicId));
    return {
      timeStart: new Date().getTime(),
      gameMode: type,
      currentTopicId: id || -1,
      totalDuration,
      isGamePaused,
      currentSubTopicIndex: currentSubTopicIndex,
      attemptNumber: attemptNumber,
      listQuestion: questions,
      currentGame,
      currentQuestionIndex,
      incorrectQuestionIds,
      isFirstAttempt: isFirstAttempt || true,
      passingThreshold,
      remainingTime,
      gameDifficultyLevel: gameDifficultyLevel,
    };
  }
);

export default initDataGame;
