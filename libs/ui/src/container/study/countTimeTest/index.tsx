import CountTime from '@ui/components/countTime';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import {
  selectCurrentTopicId,
  selectIsGamePaused,
  selectRemainingTime,
} from '@ui/redux/features/game.reselect';
import submitTestThunk from '@ui/redux/repository/game/submit/submitTest';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import React, { useCallback } from 'react';

interface GameResult {
  resultId?: number;
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

const CountTimeRemainPracticeTest = () => {
  const dispatch = useAppDispatch();
  const remainTime = useAppSelector(selectRemainingTime);
  const idTopics = useAppSelector(selectCurrentTopicId);
  const router = useRouter();
  const isPause = useAppSelector(selectIsGamePaused);
  const handleEndTime = useCallback(async () => {
    const result = (await dispatch(submitTestThunk())) as InitDataGameReturn;
    if (result.meta.requestStatus === 'fulfilled') {
      const { resultId, attemptNumber } = result.payload;
      const param = queryString.stringify({
        type: TypeParam.practiceTests,
        resultId,
        attemptNumber,
      });
      router.replace(`${RouterApp.ResultTest}?${param}`);
    }
  }, [dispatch, router, idTopics]);

  return (
    <CountTime
      duration={remainTime}
      isPause={isPause}
      onEndTime={handleEndTime}
    />
  );
};

export default React.memo(CountTimeRemainPracticeTest);
