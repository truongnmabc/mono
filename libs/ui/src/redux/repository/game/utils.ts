import { ICurrentGame, IFeedBack } from '@ui/models/game';
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
  progressData?: IUserQuestionProgress[];
  questions?: IQuestionOpt[];
  gameMode?: IGameMode;
  currentTopicId?: number;
  totalDuration?: number;
  isGamePaused?: boolean;
  remainingTime?: number;
  attemptNumber?: number;
  currentSubTopicIndex?: number;
  isFirstAttempt?: boolean;
  currentGame?: ICurrentGame;
  currentQuestionIndex?: number;
  incorrectQuestionIds?: number[];
  listQuestion?: IQuestionOpt[];
  gameDifficultyLevel?: IFeedBack;
};

export const handleMigrateDataGame = (
  state: RootState['game'],
  {
    gameMode,
    questions,
    currentTopicId,
    totalDuration,
    isGamePaused,
    remainingTime,
    attemptNumber,
    currentSubTopicIndex,
    isFirstAttempt,
    currentGame,
    currentQuestionIndex,
    incorrectQuestionIds,
    listQuestion,
    gameDifficultyLevel,
  }: IResInitDataGame
) => {
  if (typeof gameMode !== 'undefined') state.gameMode = gameMode;
  if (typeof questions !== 'undefined') state.listQuestion = questions;
  if (typeof currentTopicId !== 'undefined')
    state.currentTopicId = currentTopicId;
  if (typeof totalDuration !== 'undefined') state.totalDuration = totalDuration;
  if (typeof isGamePaused !== 'undefined') state.isGamePaused = isGamePaused;
  if (typeof remainingTime !== 'undefined') state.remainingTime = remainingTime;
  if (typeof attemptNumber !== 'undefined') state.attemptNumber = attemptNumber;
  if (typeof currentSubTopicIndex !== 'undefined')
    state.currentSubTopicIndex = currentSubTopicIndex;
  if (typeof isFirstAttempt !== 'undefined')
    state.isFirstAttempt = isFirstAttempt;
  if (typeof currentGame !== 'undefined') state.currentGame = currentGame;
  if (typeof currentQuestionIndex !== 'undefined')
    state.currentQuestionIndex = currentQuestionIndex;
  if (typeof incorrectQuestionIds !== 'undefined')
    state.incorrectQuestionIds = incorrectQuestionIds;
  if (typeof listQuestion !== 'undefined') state.listQuestion = listQuestion;
  if (typeof gameDifficultyLevel !== 'undefined')
    state.gameDifficultyLevel = gameDifficultyLevel;
};
