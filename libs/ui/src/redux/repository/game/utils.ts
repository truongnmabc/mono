import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import { RootState } from '@ui/redux/store';

export const handleInitTestQuestion = (
  state: RootState['game'],
  payload: {
    progressData: IUserQuestionProgress[];
    questions: IQuestionOpt[];
    gameMode: IGameMode;
    currentTopicId: number;
    totalDuration: number;
    isGamePaused: boolean;
    remainingTime: number;
    attemptNumber?: number;
  }
) => {
  const {
    progressData,
    questions,
    gameMode,
    currentTopicId,
    totalDuration,
    isGamePaused,
    remainingTime,
    attemptNumber,
  } = payload;

  state.totalDuration = totalDuration;
  state.gameMode = gameMode;
  if (attemptNumber) state.attemptNumber = attemptNumber;
  state.currentTopicId = currentTopicId ?? -1;
  state.listQuestion = questions;
  state.isFirstAttempt = true;
  state.isGamePaused = isGamePaused;
  state.remainingTime = remainingTime;

  if (!progressData || progressData.length === 0) {
    state.currentQuestionIndex = 0;
    state.currentGame = questions[0];
  } else {
    const firstUnansweredIndex = questions.findIndex(
      (question) => !progressData.some((answer) => answer?.id === question?.id)
    );

    state.currentQuestionIndex =
      firstUnansweredIndex > 0 ? firstUnansweredIndex : 0;

    state.currentGame = {
      ...questions[firstUnansweredIndex],
      localStatus: 'new',
      selectedAnswer: null,
    };
  }
};

type IResInitDataGame = {
  progressData: IUserQuestionProgress[];
  questions: IQuestionOpt[];
  gameMode: IGameMode;
  currentTopicId: number;
  totalDuration: number;
  isGamePaused: boolean;
  remainingTime: number;
  attemptNumber?: number;
  currentSubTopicIndex?: string;
};

export const handleMigrateDataGame = (
  state: RootState['game'],
  payload: IResInitDataGame
) => {
  const {
    progressData,
    questions,
    gameMode,
    currentTopicId,
    totalDuration,
    isGamePaused,
    remainingTime,
    attemptNumber,
    currentSubTopicIndex,
  } = payload;

  if (gameMode) state.gameMode = gameMode;
  if (questions) state.listQuestion = questions;
  if (currentTopicId) state.currentTopicId = currentTopicId;
  if (totalDuration) state.totalDuration = totalDuration;
  if (isGamePaused) state.isGamePaused = isGamePaused;
  if (remainingTime) state.remainingTime = remainingTime;
  if (attemptNumber) state.attemptNumber = attemptNumber;
  if (currentSubTopicIndex) state.currentSubTopicIndex = currentSubTopicIndex;
  if (!progressData || progressData.length === 0) {
    state.currentQuestionIndex = 0;
    state.currentGame = questions[0];
    state.isFirstAttempt = true;
  } else {
    updateExistingState(state, questions, progressData);
  }
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
