import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@ui/db';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import { RootState } from '@ui/redux/store';
import { axiosRequest } from '@ui/services/config/axios';
import {
  getLocalUserProgress,
  mapQuestionsWithProgress,
} from './initPracticeTest';

type IInitQuestion = {
  subTopicTag?: string;
  partTag?: string;
  partId: number;
  subTopicId?: number;
  isReset?: boolean;
  attemptNumber?: number;
};

interface IResInitQuestion {
  progressData?: IUserQuestionProgress[] | null | undefined;
  questions: IQuestionOpt[];
  id: number;
  parentId: number;
  gameMode: IGameMode;
  attemptNumber: number;
  timeStart?: number;
}

/**
 * Handles initializing the learn question state.
 * @param {RootState["gameReducer"]} state - The current game state.
 * @param {IResInitQuestion} payload - The new question data.
 */
export const handleInitLearnQuestion = (
  state: RootState['game'],
  payload: IResInitQuestion
) => {
  const {
    progressData,
    questions,
    id,
    parentId,
    gameMode,
    attemptNumber,
    timeStart,
  } = payload;
  state.gameMode = gameMode;
  if (!questions || questions.length === 0) {
    console.error('Questions data is undefined or empty!');
    return;
  }

  state.listQuestion = questions;
  state.currentTopicId = id;
  state.currentSubTopicProgressId = parentId;
  state.attemptNumber = attemptNumber;
  state.timeStart = timeStart;
  if (!progressData || progressData.length === 0) {
    initializeNewState(state, questions);
  } else {
    updateExistingState(state, questions, progressData);
  }
};

/**
 * Initializes the state when no progress data exists.
 * @param {RootState["gameReducer"]} state - The game state.
 * @param {IQuestionOpt[]} questions - The list of questions.
 */
const initializeNewState = (
  state: RootState['game'],
  questions: IQuestionOpt[]
) => {
  state.currentQuestionIndex = 0;
  state.currentGame = questions[0];
  state.isFirstAttempt = true;
};

/**
 * Updates the state based on existing progress data.
 * @param {RootState["gameReducer"]} state - The game state.
 * @param {IQuestionOpt[]} questions - The list of questions.
 * @param {IUserQuestionProgress[]} progressData - The user's progress data.
 */
const updateExistingState = (
  state: RootState['game'],
  questions: IQuestionOpt[],
  progressData: IUserQuestionProgress[]
) => {
  const firstUnansweredIndex = questions.findIndex(
    (question) => !progressData.some((answer) => answer?.id === question?.id)
  );

  if (firstUnansweredIndex === -1) {
    handleAllQuestionsAnswered(state, questions, progressData);
  } else {
    state.incorrectQuestionIds = progressData
      .filter((item) => !item.selectedAnswers?.some((ans) => ans.correct))
      .map((item) => item.id);
    state.currentQuestionIndex = firstUnansweredIndex;
    state.currentGame = {
      ...state.listQuestion[firstUnansweredIndex],
      localStatus: 'new',
      selectedAnswer: null,
    };
  }
};

/**
 * Handles the state when all questions have been answered once.
 * @param {RootState["gameReducer"]} state - The game state.
 * @param {IQuestionOpt[]} questions - The list of questions.
 * @param {IUserQuestionProgress[]} progressData - The user's progress data.
 */
const handleAllQuestionsAnswered = (
  state: RootState['game'],
  questions: IQuestionOpt[],
  progressData: IUserQuestionProgress[]
) => {
  const wrongAnswers = questions.filter(
    (question) =>
      !progressData.some(
        (answer) =>
          answer.id === question?.id &&
          answer.selectedAnswers?.some((ans) => ans.correct)
      )
  );

  state.isFirstAttempt = false;
  state.currentGame = {
    ...wrongAnswers[0],
    localStatus: 'new',
    selectedAnswer: null,
    paragraph: {
      id: -1,
      text: '',
    },
    partId: -1,
    subTopicId: -1,
    subTopicTag: '',
    icon: '1',
    contentType: 0,
    tag: '',
    turn: 1,
  };
  state.currentQuestionIndex = questions.findIndex(
    (item) => item?.id === wrongAnswers[0]?.id
  );
  state.incorrectQuestionIds = wrongAnswers.map((item) => item.id);
};

/**
 * Fetches question data from the database or API.
 * @param {IInitQuestion} params - The parameters for fetching questions.
 * @return {Promise<IResInitQuestion>} The processed question data.
 */

const initLearnQuestionThunk = createAsyncThunk(
  'initLearnQuestionThunk',
  async (
    { partId, subTopicId, isReset, attemptNumber }: IInitQuestion,
    thunkAPI
  ): Promise<IResInitQuestion> => {
    console.log('🚀 ~ attemptNumber:', attemptNumber);
    const state = thunkAPI.getState() as RootState;
    let { isDataFetched } = state.appInfo;

    while (!isDataFetched) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      isDataFetched = (thunkAPI.getState() as RootState).appInfo.isDataFetched;
    }
    const listQuestions = await db?.questions
      .where('partId')
      .equals(partId)
      .toArray();

    if (!listQuestions || listQuestions?.length === 0) {
      const data = (await axiosRequest({
        url: `api/question/get-questions-by-part-id?partId=${partId}`,
        baseUrl: 'https://api-cms-v2-dot-micro-enigma-235001.appspot.com',
      })) as unknown as IQuestionOpt[];

      return {
        questions: data.map((item) => ({
          ...item,
          text: item.text,
          explanation: item.explanation,
          localStatus: 'new',
        })),
        progressData: [],
        id: partId || 0,
        parentId: subTopicId || 0,
        gameMode: 'learn',
        attemptNumber: attemptNumber || 1,
      };
    }

    const questionIdsSet = listQuestions.map((q) => q.id);

    const progressData = await getLocalUserProgress(
      questionIdsSet,
      'learn',
      attemptNumber || 1,
      partId
    );

    const questions = mapQuestionsWithProgress(
      listQuestions,
      progressData
    ) as IQuestionOpt[];

    return {
      questions: questions,
      progressData: isReset ? [] : progressData,
      id: partId,
      parentId: subTopicId || 0,
      gameMode: 'learn',
      attemptNumber: attemptNumber || 1,
      timeStart: new Date().getTime(),
    };
  }
);
export default initLearnQuestionThunk;
