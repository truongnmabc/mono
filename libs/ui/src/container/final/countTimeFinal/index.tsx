import CountTime from '@ui/components/countTime';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import {
  selectIsGamePaused,
  selectRemainingTime,
} from '@ui/redux/features/game.reselect';
import submitTestThunk from '@ui/redux/repository/game/submit/submitTest';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const CountTimeFinalTest = ({ testId }: { testId: number }) => {
  const dispatch = useAppDispatch();
  const remainTime = useAppSelector(selectRemainingTime);
  const isPause = useAppSelector(selectIsGamePaused);
  const router = useRouter();
  const handleEndTime = useCallback(async () => {
    const result = await dispatch(submitTestThunk());
    const _href = `${RouterApp.ResultTest}?type=${TypeParam.finalTests}&testId=${testId}`;
    router.replace(_href);
  }, [dispatch, router, testId]);

  return (
    <CountTime
      isPause={isPause}
      duration={remainTime}
      onEndTime={handleEndTime}
    />
  );
};

export default CountTimeFinalTest;
