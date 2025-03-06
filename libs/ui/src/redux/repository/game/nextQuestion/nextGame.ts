import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@ui/db';
import { ICurrentGame } from '@ui/models/game';
import { RootState } from '@ui/redux/store';

type IRes = {
  nextLever: number;
  nextQuestion: ICurrentGame;
  isFirst: boolean;
  timeStart: number;
  isDisabled: boolean;
  isFinish: boolean;
};
const nextQuestionActionThunk = createAsyncThunk(
  'nextQuestionActionThunk',
  async (_, thunkAPI): Promise<IRes | undefined> => {
    const state = thunkAPI.getState() as RootState;
    const { listQuestion, gameMode } = state.game;
    const isFinish =
      gameMode === 'learn' &&
      listQuestion.every((item) => item.localStatus === 'correct');
    const actions = {
      learn: () => handleNextQuestionLearn(isFinish, state.game),
      practiceTests: async () => await handleNextQuestionPracticeTests(),
      diagnosticTest: () => handleNextQuestionDiagnosticTest(),
      customTets: () => handleNextQuestionCustomTets(),
      review: () => handleReview(),
    };
    const action = actions[gameMode];
    // isDisabled  trạng thái button next question
    return {
      isDisabled: true,
      isFinish: false,
    };
  }
);

export default nextQuestionActionThunk;

export const handleNextQuestionLearn = async (
  isFinish: boolean,
  gameState: RootState['game']
) => {
  const {
    isFirstAttempt,
    currentQuestionIndex,
    listQuestion,
    incorrectQuestionIds,
    currentTopicId,
  } = gameState;

  if (isFinish) {
    const currentTopics = await db?.topics.get(currentTopicId);

    if (currentTopics) {
      await db?.topics
        .where('id')
        .equals(currentTopicId)
        .modify((topic) => {
          topic.status = 1;
        });
    }
    return {
      isDisabled: false,
      isFinish: true,
      index: currentTopics?.index,
      turn: currentTopics?.turn,
    };
  } else {
    if (isFirstAttempt && currentQuestionIndex + 1 < listQuestion.length) {
      return {
        nextLever: currentQuestionIndex + 1,
        nextQuestion: listQuestion[currentQuestionIndex + 1],
        isFirst: true,
        timeStart: new Date().getTime(),
        isFinish: false,
        isDisabled: false,
      };
    }

    if (incorrectQuestionIds.length > 0) {
      const idQuestionInCorrect = incorrectQuestionIds[0];

      const indexQuestion = listQuestion.findIndex(
        (item) => item.id === idQuestionInCorrect
      );

      return {
        nextLever: indexQuestion,
        nextQuestion: {
          ...listQuestion[indexQuestion],
          selectedAnswer: null,
          localStatus: 'new',
        },
        isFirst: false,
        timeStart: new Date().getTime(),
      };
    }
    return {
      isDisabled: false,
      isFinish: false,
    };
  }
};

export const handleNextQuestionPracticeTests = () => {};

export const handleNextQuestionDiagnosticTest = () => {};

export const handleNextQuestionCustomTets = () => {};

export const handleReview = () => {};
