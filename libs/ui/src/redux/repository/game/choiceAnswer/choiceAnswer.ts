import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@ui/db';
import { ICurrentGame } from '@ui/models/game';
import { IAnswer } from '@ui/models/question';
import { RootState } from '@ui/redux/store';

const choiceAnswer = createAsyncThunk(
  'choiceAnswer',
  async (
    { question, choice }: { question: ICurrentGame; choice: IAnswer },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;
    const { attemptNumber, currentTopicId, gameMode, timeStart } = state.game;

    const isEx = await db?.userProgress.get(question.id);

    const updatedSelectedAnswers = isEx
      ? [
          ...(isEx?.selectedAnswers || []),
          {
            turn: attemptNumber,
            parentId: currentTopicId,
            id: choice.id,
            index: choice.index,
            correct: choice.correct,
            type: gameMode,
            startAt: timeStart,
            endAt: new Date().getTime(),
            isSynced: false,
          },
        ]
      : [
          {
            turn: attemptNumber,
            parentId: currentTopicId,
            id: choice.id,
            correct: choice.correct,
            index: choice.index,
            type: gameMode,
            startAt: timeStart,
            endAt: new Date().getTime(),
            isSynced: false,
          },
        ];

    const data = {
      selectedAnswers: updatedSelectedAnswers,
      id: question.id,
      parentId: question.partId,
      level: question.level === -1 ? 50 : question.level,
      isSynced: false,
    };

    if (isEx) {
      await db?.userProgress.update(question.id, data);
    } else {
      await db?.userProgress.add(data);
    }

    return {
      choice,
      question,
    };
  }
);

export const processChoiceAnswer = (
  state: RootState['game'],
  payload: { choice: IAnswer; question: ICurrentGame }
) => {
  const { choice, question } = payload;

  state.currentGame.selectedAnswer = choice;
  state.currentGame.localStatus = choice.correct ? 'correct' : 'incorrect';

  if (!choice.correct) {
    const newArr = [...state.incorrectQuestionIds];
    if (newArr.length === 1 && !state.isFirstAttempt) {
      const indexRandom = Math.floor(Math.random() * state.listQuestion.length);
      state.currentQuestionIndex = indexRandom;
      state.listQuestion[indexRandom] = {
        ...state.listQuestion[indexRandom],
        selectedAnswer: null,
        localStatus: 'new',
      };
      newArr.unshift(state.listQuestion[indexRandom].id);
    } else {
      if (newArr.includes(question.id)) {
        newArr.shift();
        newArr.push(question.id);
      } else {
        newArr.push(question.id);
      }
    }

    state.incorrectQuestionIds = newArr;
  } else {
    state.incorrectQuestionIds = state.incorrectQuestionIds.filter(
      (id) => id !== question.id
    );
  }

  const questionIndex = state.listQuestion.findIndex(
    (q) => q.id === question.id
  );

  if (questionIndex !== -1) {
    state.listQuestion[questionIndex] = {
      ...state.listQuestion[questionIndex],
      selectedAnswer: choice,
      localStatus: choice.correct ? 'correct' : 'incorrect',
    };
  }
};

export default choiceAnswer;
