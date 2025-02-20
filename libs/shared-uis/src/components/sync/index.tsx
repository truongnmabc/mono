'use client';
import { selectAppInfo } from '@shared-redux/features/appInfo.reselect';
import { selectUserInfo } from '@shared-redux/features/user.reselect';
import { getUserDeviceLogin } from '@shared-redux/repository/sync/syncData';
import { useAppDispatch, useAppSelector } from '@shared-redux/store';
import { useEffect, useState } from 'react';

const SyncData = () => {
  const appInfos = useAppSelector(selectAppInfo);
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo?.id && appInfos && !isMount) {
      setIsMount(true);
      dispatch(
        getUserDeviceLogin({
          appInfo: appInfos,
          email: userInfo?.email,
        })
      );
    }
  }, [userInfo, appInfos, dispatch, isMount]);
  return null;
};

export default SyncData;
