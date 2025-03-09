import { db } from '@ui/db';
import { RootState } from '@ui/redux/store';
import { IStatusAnswer } from '@ui/models/question';
import { saveDataDbLearn } from '../../submit/submitTest';

export const handleNextQuestionLearn = async (gameState: RootState['game']) => {
  const {
    isFirstAttempt,
    currentQuestionIndex,
    listQuestion,
    incorrectQuestionIds,
    currentTopicId,
    gameMode,
  } = gameState;
  const isFinish =
    gameMode === 'learn' &&
    listQuestion.every((item) => item.localStatus === 'correct');
  if (isFinish) {
    const currentTopics = await db?.topics.get(currentTopicId);
    if (currentTopics) {
      const { currentQuestionIndex, attemptNumber, resultId } =
        await saveDataDbLearn(currentTopicId);
      return {
        currentQuestionIndex,
        attemptNumber,
        resultId,
        index: currentTopics.index,
        topic: currentTopics.slug,
        isFinish,
      };
    }
  }
  if (isFirstAttempt && currentQuestionIndex + 1 < listQuestion.length) {
    return {
      currentQuestionIndex: currentQuestionIndex + 1,
      currentGame: listQuestion[currentQuestionIndex + 1],
      isFirstAttempt: true,
    };
  }
  if (incorrectQuestionIds.length > 0) {
    const idQuestionInCorrect = incorrectQuestionIds[0];

    const indexQuestion = listQuestion.findIndex(
      (item) => item.id === idQuestionInCorrect
    );

    return {
      currentQuestionIndex: indexQuestion,
      currentGame: {
        ...listQuestion[indexQuestion],
        selectedAnswer: null,
        localStatus: 'new' as IStatusAnswer,
      },
      isFirstAttempt: false,
      isFinish,
    };
  }

  return {};
};
