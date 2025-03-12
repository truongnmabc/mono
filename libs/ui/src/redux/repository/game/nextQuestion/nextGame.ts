import { createAsyncThunk } from '@reduxjs/toolkit';
import { TypeParam } from '@ui/constants';
import { db } from '@ui/db';
import { ICurrentGame } from '@ui/models/game';
import { handleNextQuestionLearn } from '@ui/redux/repository/game/nextQuestion/utils/learn';
import { RootState } from '@ui/redux/store';
import { syncUp } from '../../sync/syncUp';

interface IRes extends ActionResponse {
  timeStart?: number;
  shouldUpdatePro?: boolean;
}
type ActionResponse = {
  currentQuestionIndex?: number;
  index?: string;
  topic?: string;
  currentGame?: ICurrentGame;
  isFirstAttempt?: boolean;
  attemptNumber?: number;
  resultId?: number;
  isFinish?: boolean;
};
const nextQuestionActionThunk = createAsyncThunk(
  'nextQuestionActionThunk',
  async (_, thunkAPI): Promise<IRes | undefined> => {
    const state = thunkAPI.getState() as RootState;
    const { gameMode, currentQuestionIndex: indexQuestion } = state.game;

    if (gameMode === TypeParam.finalTests) {
      const isPro = state.user.userInfo.isPro;
      const maxView = indexQuestion >= 49;
      if (!isPro && maxView) {
        return {
          shouldUpdatePro: true,
        };
      }
    }
    const actions: Record<string, () => Promise<ActionResponse>> = {
      learn: async () => await handleNextQuestionLearn(state.game),
      practiceTests: async () => await handleNextQuestion(state.game),
      diagnosticTest: async () => await handleNextQuestion(state.game),
      finalTests: async () => await handleNextQuestion(state.game),
      branchTest: async () => await handleNextQuestion(state.game),
      customTests: async () => await handleNextQuestion(state.game),
      review: async () => await handleNextQuestion(state.game),
    } as const;
    const action = actions[gameMode];
    const {
      attemptNumber,
      currentQuestionIndex,
      currentGame,
      isFirstAttempt,
      resultId,
      isFinish,
      index,
      topic,
    } = await action();
    const { userInfo } = state.user;
    if (userInfo.email && isFinish) {
      thunkAPI.dispatch(syncUp({}));
    }
    return {
      isFinish: isFinish,
      timeStart: new Date().getTime(),
      currentQuestionIndex: currentQuestionIndex,
      currentGame: currentGame,
      isFirstAttempt: isFirstAttempt,
      attemptNumber: attemptNumber,
      resultId: resultId,
      index: index,
      topic: topic,
    };
  }
);

export default nextQuestionActionThunk;

export const handleNextQuestion = async (gameState: RootState['game']) => {
  const { listQuestion, currentQuestionIndex, currentTopicId, attemptNumber } =
    gameState;

  if (currentQuestionIndex + 1 < listQuestion.length) {
    return {
      currentGame: listQuestion[currentQuestionIndex + 1],
      currentQuestionIndex: currentQuestionIndex + 1,
      isFirstAttempt: true,
    };
  }
  await db?.testQuestions
    .where('id')
    .equals(currentTopicId || -1)
    .modify((item) => {
      item.status = 1;
    });
  return {
    resultId: currentTopicId,
    attemptNumber: attemptNumber,
    isFinish: true,
  };
};
