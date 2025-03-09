'use client';
import CountTime from '@ui/components/countTime';
import ClockIcon from '@ui/components/icon/ClockIcon';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import {
  selectCurrentTopicId,
  selectRemainingTime,
} from '@ui/redux/features/game.reselect';
import submitTestThunk from '@ui/redux/repository/game/submit/submitTest';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
const CountTimeCustomTest = () => {
  const dispatch = useAppDispatch();

  const remainTime = useAppSelector(selectRemainingTime);
  const router = useRouter();
  const idTopics = useAppSelector(selectCurrentTopicId);

  const handleEndTime = useCallback(async () => {
    const result = await dispatch(submitTestThunk());

    const _href = `${RouterApp.ResultTest}?type=${TypeParam.customTests}&testId=${idTopics}`;
    router.replace(_href);
  }, [dispatch, router, idTopics]);
  if (remainTime > 0) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-center w-fit gap-2">
          <ClockIcon />
          <CountTime duration={remainTime} onEndTime={handleEndTime} />
        </div>
      </div>
    );
  }

  return null;
};

export default CountTimeCustomTest;
