import { db } from '@ui/db';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IQuestionBase, IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import { IUserQuestionProgress } from '@ui/models/progress';
import { RootState } from '@ui/redux/store';
import { axiosRequest } from '@ui/services/config/axios';
import {
  getLocalUserProgress,
  mapQuestionsWithProgress,
} from './initPracticeTest';

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
  progressData?: IUserQuestionProgress[] | null | undefined;
  questions: IQuestionOpt[];
  id: number;
  gameMode: IGameMode;
  turn: number;
  timeStart?: number;
  currentTopicId: number;
  totalDuration: number;
  isGamePaused: boolean;
  remainingTime: number;
  attemptNumber?: number;
}

const initDataGame = createAsyncThunk(
  'initDataGame',
  async (
    { partId, type, slug, turn, isReset }: IInitQuestion,
    thunkAPI
  ): Promise<IResInitQuestion> => {
    const state = thunkAPI.getState() as RootState;
    let { isDataFetched } = state.appInfo;

    while (!isDataFetched) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      isDataFetched = (thunkAPI.getState() as RootState).appInfo.isDataFetched;
    }
    let listQuestions: IQuestionBase[] = [];
    let attemptNumber = turn || 1;
    let id = partId || -1;
    switch (type) {
      case 'learn':
        const {
          turn,
          list,
          id: idPart,
        } = await handleGetDataLean({
          partId,
          slug,
        });
        attemptNumber = turn || 1;
        listQuestions = list || [];
        id = idPart;
        break;
      default:
        break;
    }
    const questionIdsSet = listQuestions.map((q) => q.id);
    const progressData = await getLocalUserProgress(
      questionIdsSet,
      type,
      attemptNumber,
      id
    );
    const questions = mapQuestionsWithProgress(
      listQuestions,
      progressData
    ) as IQuestionOpt[];
    return {
      questions: questions,
      progressData: progressData,
      id: id,
      timeStart: new Date().getTime(),
      turn: attemptNumber,
      gameMode: type,
      currentTopicId: id,
      totalDuration: 0,
      isGamePaused: false,
      remainingTime: 0,
    };
  }
);
export default initDataGame;

type IPropsLearn = {
  partId?: number;
  slug?: string;
};
const handleGetDataLean = async ({ partId, slug }: IPropsLearn) => {
  let id = partId || -1;
  let attemptNumber = 1;
  if (!partId) {
    const list = await db?.topics
      .where('slug')
      .equals(slug || '')
      .sortBy('index');
    const currentPart = list?.find((item) => item.status === 0);
    if (currentPart) {
      id = currentPart.id;
      attemptNumber = currentPart.turn;
    }
  } else {
    const topics = await db?.topics.get(partId);
    if (topics) {
      id = topics.id;
      attemptNumber = topics.turn;
    }
  }

  const listQuestions =
    (await db?.questions.where('partId').equals(id).toArray()) || [];
  return { turn: attemptNumber, list: listQuestions, id };
};
