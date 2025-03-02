import CountTime from '@ui/components/countTime';
import { shouldEndTimeTest } from '@ui/redux/features/game';
import {
  selectCurrentTopicId,
  selectIsGamePaused,
  selectRemainingTime,
} from '@ui/redux/features/game.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import finishPracticeThunk from '@ui/redux/repository/game/finish/finishPracticeTest';
import RouterApp from '@ui/constants/router.constant';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { TypeParam } from '@ui/constants';

const CountTimeRemainPracticeTest = () => {
  const dispatch = useAppDispatch();

  const remainTime = useAppSelector(selectRemainingTime);
  const idTopics = useAppSelector(selectCurrentTopicId);
  const router = useRouter();
  const isPause = useAppSelector(selectIsGamePaused);
  const handleEndTime = useCallback(() => {
    dispatch(finishPracticeThunk());
    dispatch(shouldEndTimeTest(true));

    const _href = `${RouterApp.ResultTest}?type=${TypeParam.practiceTest}&testId=${idTopics}`;
    router.replace(_href);
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
