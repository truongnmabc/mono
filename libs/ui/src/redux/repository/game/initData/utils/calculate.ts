import { IGameMode } from '@ui/models/tests/tests';
import {
  getLocalUserProgress,
  mapQuestionsWithProgress,
} from '@ui/redux/repository/utils/handle';

import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionOpt, IStatusAnswer } from '@ui/models/question';

export const getQuestionProgress = async (
  type: IGameMode,
  id: number | undefined,
  listQuestions: IQuestionOpt[] | undefined,
  attemptNumber: number
) => {
  const questionIdsSet = listQuestions?.map((q) => q.id) || [];

  const progressData =
    (await getLocalUserProgress(
      questionIdsSet,
      type,
      attemptNumber,
      id || -1
    )) || [];

  return {
    questions: mapQuestionsWithProgress(
      listQuestions || [],
      progressData
    ) as IQuestionOpt[],
    progressData,
  };
};

export const getNextQuestionState = (
  questions: IQuestionOpt[],
  progressData: IUserQuestionProgress[]
) => {
  let currentQuestionIndex = 0;
  let currentGame = questions[0];
  let isFirstAttempt = true;
  let incorrectQuestionIds: number[] = [];

  if (progressData.length === 0) {
    return {
      currentQuestionIndex,
      currentGame,
      isFirstAttempt,
      incorrectQuestionIds,
    };
  }

  const firstUnansweredIndex = questions.findIndex(
    (question) => !progressData.some((answer) => answer?.id === question?.id)
  );

  if (firstUnansweredIndex === -1) {
    const wrongAnswers = questions.filter(
      (question) =>
        !progressData.some(
          (answer) =>
            answer.id === question?.id &&
            answer.selectedAnswers?.some((ans) => ans.correct)
        )
    );

    return {
      isFirstAttempt: false,
      currentGame: {
        ...wrongAnswers[0],
        localStatus: 'new' as IStatusAnswer,
        selectedAnswer: null,
        paragraph: { id: -1, text: '' },
        partId: -1,
        subTopicId: -1,
        subTopicTag: '',
        icon: '1',
        contentType: 0,
        tag: '',
        turn: 1,
      },
      currentQuestionIndex: questions.findIndex(
        (item) => item?.id === wrongAnswers[0]?.id
      ),
      incorrectQuestionIds: wrongAnswers.map((item) => item.id),
    };
  }

  return {
    incorrectQuestionIds: progressData
      .filter((item) => !item.selectedAnswers?.some((ans) => ans.correct))
      .map((item) => item.id),
    currentQuestionIndex: firstUnansweredIndex,
    currentGame: {
      ...questions[firstUnansweredIndex],
      localStatus: 'new' as IStatusAnswer,
      selectedAnswer: null,
    },
    isFirstAttempt: true,
  };
};
