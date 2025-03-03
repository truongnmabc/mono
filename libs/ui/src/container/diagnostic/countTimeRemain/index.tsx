import CountTime from '@ui/components/countTime';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import {
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectCurrentTopicId,
  selectIsGamePaused,
  selectListQuestion,
  selectRemainingTime,
} from '@ui/redux/features/game.reselect';
import choiceAnswer from '@ui/redux/repository/game/choiceAnswer/choiceAnswer';
import finishDiagnosticThunk from '@ui/redux/repository/game/finish/finishDiagnostic';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

const CountTimeDiagnostic = () => {
  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const remainTime = useAppSelector(selectRemainingTime);
  const listQuestion = useAppSelector(selectListQuestion);
  const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
  const listLength = listQuestion?.length || 0;
  const router = useRouter();
  const isPause = useAppSelector(selectIsGamePaused);
  const idTopics = useAppSelector(selectCurrentTopicId);

  const handleEndTime = useCallback(() => {
    if (indexCurrentQuestion + 1 === listLength) {
      dispatch(finishDiagnosticThunk());
      router.replace(RouterApp.ResultTest, { scroll: true });
      const _href = `${RouterApp.ResultTest}?type=${TypeParam.diagnosticTest}&testId=${idTopics}`;
      router.replace(_href);
    } else {
      if (!currentGame.selectedAnswer) {
        dispatch(
          choiceAnswer({
            question: currentGame,
            choice: {
              correct: false,
              explanation: '',
              id: -1,
              index: -1,
              text: '',
              turn: 1,
              type: 'diagnosticTest',
              parentId: -1,
            },
          })
        );
      }
    }
  }, [
    indexCurrentQuestion,
    listLength,
    dispatch,
    currentGame,
    router,
    idTopics,
  ]);

  const pause = isPause || (currentGame?.selectedAnswer ? true : false);
  console.log('🚀 ~ CountTimeDiagnostic ~ pause:', pause);

  return (
    <div className="min-w-20">
      <CountTime
        isPause={pause}
        key={currentGame?.id}
        duration={remainTime}
        onEndTime={handleEndTime}
      />
    </div>
  );
};

export default React.memo(CountTimeDiagnostic);
