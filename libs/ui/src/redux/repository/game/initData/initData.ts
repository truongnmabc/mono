import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionBase, IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import { setIsUnmount } from '@ui/redux/features/appInfo';
import { selectTopics } from '@ui/redux/features/study';
import { RootState } from '@ui/redux/store';
import selectSubTopicThunk from '../../study/select';
import {
  getLocalUserProgress,
  mapQuestionsWithProgress,
} from './initPracticeTest';
import { handleGetDataDiagnosticTest } from './utils/diagnostic';
import { handleGetDataFinalTest } from './utils/final';
import { handleGetDataLean } from './utils/learn';
import { handleGetDataPracticeTest } from './utils/practice';

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
};
interface IResInitQuestion {
  progressData?: IUserQuestionProgress[];
  questions?: IQuestionOpt[];
  id?: number;
  gameMode?: IGameMode;
  timeStart?: number;
  currentTopicId?: number;
  totalDuration?: number;
  isGamePaused?: boolean;
  remainingTime?: number;
  attemptNumber?: number;
  currentSubTopicIndex?: string;
  isCompleted?: boolean;
  resultId?: number;
}

const initDataGame = createAsyncThunk(
  'initDataGame',
  async (params: IInitQuestion, thunkAPI): Promise<IResInitQuestion> => {
    const { partId, type, slug, turn, topicId, testId } = params;
    const state = thunkAPI.getState() as RootState;
    let { isDataFetched } = state.appInfo;

    while (!isDataFetched) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      isDataFetched = (thunkAPI.getState() as RootState).appInfo.isDataFetched;
    }

    const modeHandlers: Record<
      IGameMode,
      () => Promise<{
        listQuestions?: IQuestionBase[];
        id?: number;
        attemptNumber?: number;
        index?: string;
        parentId?: number;
        isGamePaused?: boolean;
        subTopicId?: number;
        isCompleted?: boolean;
      }>
    > = {
      learn: async () => await handleGetDataLean({ partId, slug }),
      diagnosticTest: async () => await handleGetDataDiagnosticTest({ testId }),
      finalTests: async () => await handleGetDataFinalTest({ testId }),
      branchTest: async () =>
        await handleGetDataPracticeTest({
          testId,
          type: 'branchTest',
        }),
      customTests: async () => ({
        listQuestions: [],
        id: -1,
        subTopicId: -1,
        attemptNumber: 1,
        index: '',
      }),
      practiceTests: async () =>
        await handleGetDataPracticeTest({ testId, type: 'practiceTests' }),
      review: async () => ({
        listQuestions: [],
        id: -1,
        subTopicId: -1,
        attemptNumber: 1,
        index: '',
      }),
    };

    const { listQuestions, id, subTopicId, attemptNumber, index, isCompleted } =
      await (modeHandlers[type] || modeHandlers.learn)();

    if (isCompleted) {
      thunkAPI.dispatch(setIsUnmount(true));

      return {
        isCompleted: true,
        resultId: id,
        currentSubTopicIndex: index,
        attemptNumber,
      };
    }
    const questionIdsSet = listQuestions?.map((q) => q.id) || [];

    const progressData =
      (await getLocalUserProgress(
        questionIdsSet,
        type,
        attemptNumber || 1,
        id || -1
      )) || [];

    const questions = mapQuestionsWithProgress(
      listQuestions || [],
      progressData
    ) as IQuestionOpt[];

    if (topicId) {
      setTimeout(() => {
        thunkAPI.dispatch(selectTopics(topicId));
      }, 500);
    }

    if (subTopicId) {
      setTimeout(() => {
        thunkAPI.dispatch(selectSubTopicThunk(subTopicId));
      }, 1000);
    }

    return {
      questions: questions,
      progressData: progressData,
      id: id || -1,
      timeStart: new Date().getTime(),
      gameMode: type,
      currentTopicId: id || -1,
      totalDuration: 0,
      isGamePaused: false,
      remainingTime: 0,
      currentSubTopicIndex: index,
      attemptNumber: attemptNumber,
    };
  }
);
export default initDataGame;
