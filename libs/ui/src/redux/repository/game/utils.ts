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
  } = payload;

  if (gameMode) state.gameMode = gameMode;
  if (questions) state.listQuestion = questions;
  if (currentTopicId) state.currentTopicId = currentTopicId;
  if (totalDuration) state.totalDuration = totalDuration;
  if (isGamePaused) state.isGamePaused = isGamePaused;
  if (remainingTime) state.remainingTime = remainingTime;
  if (attemptNumber) state.attemptNumber = attemptNumber;
};
