'use client';
import { selectAppInfo } from '@ui/redux/features/appInfo.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { getUserDeviceLogin } from '@ui/redux/repository/sync/syncData';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
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
