import CountTime from '@ui/components/countTime';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import {
  selectCurrentTopicId,
  selectIsGamePaused,
  selectRemainingTime,
} from '@ui/redux/features/game.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import finishFinalThunk from '@ui/redux/repository/game/finish/finishFinal';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const CountTimeFinalTest = () => {
  const dispatch = useAppDispatch();
  const remainTime = useAppSelector(selectRemainingTime);
  const isPause = useAppSelector(selectIsGamePaused);
  const router = useRouter();
  const idTopics = useAppSelector(selectCurrentTopicId);
  const handleEndTime = useCallback(() => {
    dispatch(finishFinalThunk());
    const _href = `${RouterApp.ResultTest}?type=${TypeParam.finalTest}&testId=${idTopics}`;
    router.replace(_href);
  }, [dispatch, router, idTopics]);

  return (
    <CountTime
      isPause={isPause}
      duration={remainTime}
      onEndTime={handleEndTime}
    />
  );
};

export default CountTimeFinalTest;
