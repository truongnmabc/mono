'use client';

import { selectAppInfo } from '@shared-redux/features/appInfo.reselect';
import { selectUserInfo } from '@shared-redux/features/user.reselect';
import initFinalTestThunk from '@shared-redux/repository/game/initData/initFinalTest';
import { useAppDispatch, useAppSelector } from '@shared-redux/store';
import { MtUiButton } from '@shared-uis/components/button';
import RouterApp from 'libs/constants/router.constant';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

const FinalTestBtn = () => {
  const appInfo = useAppSelector(selectAppInfo);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);
  const router = useRouter();

  const handleClick = useCallback(async () => {
    if (!userInfo.isPro) {
      const _href = `${RouterApp.Get_pro}`;
      router.push(_href);
      return;
    }
    dispatch(initFinalTestThunk());
    router.push(RouterApp.Final_test);
  }, [router, dispatch, userInfo]);

  return (
    <MtUiButton block type="primary" onClick={handleClick}>
      <p className="text-base capitalize font-semibold text-white">
        <span className="text-base  font-semibold text-white uppercase">
          {appInfo.appShortName}
        </span>{' '}
        Final Test
      </p>
    </MtUiButton>
  );
};
export default React.memo(FinalTestBtn);
