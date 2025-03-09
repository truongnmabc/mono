import CountTime from '@ui/components/countTime';
import RouterApp from '@ui/constants/router.constant';
import {
  selectCurrentGame,
  selectIsGamePaused,
  selectRemainingTime,
} from '@ui/redux/features/game.reselect';
import choiceUnAnswerDiagnostic from '@ui/redux/repository/game/choiceAnswer/choiceAnswerDiagnostic';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import React, { useCallback } from 'react';

interface GameResult {
  isCompleted?: boolean;
  resultId?: number;
  currentSubTopicIndex?: string;
  attemptNumber?: number;
}
type InitDataGameReturn = {
  payload: GameResult;
  type: string;
  meta: {
    requestId: string;
    requestStatus: 'fulfilled' | 'rejected';
  };
};

const CountTimeDiagnostic = ({ testId }: { testId?: number }) => {
  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const remainTime = useAppSelector(selectRemainingTime);
  const router = useRouter();
  const isPause = useAppSelector(selectIsGamePaused);

  const handleEndTime = useCallback(async () => {
    const result = (await dispatch(
      choiceUnAnswerDiagnostic()
    )) as unknown as InitDataGameReturn;
    if (result.payload?.isCompleted) {
      const { resultId, currentSubTopicIndex, attemptNumber } = result.payload;
      const param = queryString.stringify({
        resultId: resultId,
        index: currentSubTopicIndex,
        turn: attemptNumber,
        testId: testId,
      });
      setTimeout(() => {
        router.replace(`${RouterApp.ResultTest}?${param}`);
      }, 250);
    }
  }, [testId]);

  const pause = isPause || (currentGame?.selectedAnswer ? true : false);

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
