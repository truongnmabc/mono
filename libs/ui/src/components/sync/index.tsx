'use client';
import { db } from '@ui/db';
import {
  selectAppInfo,
  selectIsDataFetched,
} from '@ui/redux/features/appInfo.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { clearDbLocalBeforeSync } from '@ui/redux/repository/sync/clearDbLocalBeforeSync';
import { syncDown } from '@ui/redux/repository/sync/syncDown';
import { syncUp } from '@ui/redux/repository/sync/syncUp';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { updateLoginStatusAndCheckUserData } from '@ui/services/sync';
import { useCallback, useEffect, useState } from 'react';
import { MtUiButton } from '../button';
import DialogResponsive from '../dialogResponsive';
import { IconArrowRight, SelectIconSync } from './icon';
export interface IPropsUpdateLogin {
  has_user_data: boolean;
  sync_key: string;
}

const SyncData = () => {
  const appInfos = useAppSelector(selectAppInfo);
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const isFetched = useAppSelector(selectIsDataFetched);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [syncKey, setSyncKey] = useState('');
  const handleSyncData = useCallback(async () => {
    if (!userInfo?.id || !appInfos) return;

    const syncData = (await updateLoginStatusAndCheckUserData({
      appId: appInfos.appId,
      email: userInfo.email,
      name: userInfo.name,
      photoUrl: userInfo.image,
      phoneNumber: userInfo.phoneNumber,
      platform: 'web',
      providerId: 'google',
      providerData: userInfo.id,
    })) as unknown as IPropsUpdateLogin;
    console.log('🚀 ~ handleSyncData ~ syncData:', syncData);

    if (!syncData.has_user_data) return dispatch(syncUp());

    const app = await db?.passingApp.get(-1);
    if (!app) return dispatch(syncUp());

    if (!app.syncKey || (app.syncKey && syncData.sync_key !== app.syncKey)) {
      setSyncKey(syncData.sync_key);
      setIsShowPopup(true);
    } else {
      dispatch(syncDown());
    }
    return;
  }, [userInfo, appInfos, dispatch]);

  const handleChoiceDb = async (name: string) => {
    try {
      if (name === 'local') {
        dispatch(syncUp());
      } else {
        await dispatch(clearDbLocalBeforeSync());
        await db?.passingApp.update(-1, {
          syncKey: syncKey,
        });
        dispatch(syncDown());
      }
    } catch (err) {
      console.log('🚀 ~ handleChoiceDb ~ err:', err);
    } finally {
      setIsShowPopup(false);
    }
  };
  useEffect(() => {
    if (isFetched) handleSyncData();
  }, [isFetched, handleSyncData]);
  const handleClose = () => setIsShowPopup(false);
  return (
    <DialogResponsive
      open={isShowPopup}
      close={handleClose}
      dialogRest={{
        sx: {
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: '520px',
            maxHeight: '420px',
            height: '100%',

            borderRadius: '12px',
          },
        },
      }}
    >
      <div className=" p-8 flex flex-col gap-8  w-full h-full   bg-[#F9F7EE]">
        <div className="flex-1 flex flex-col gap-4 items-center justify-center">
          <SelectIconSync />
          <p className="text-2xl font-semibold text-center">Select Data </p>
          <p className="text-base font-normal text-center">
            The data on this device does not match the data on your previous
            device. Which data do you want to use?
          </p>
        </div>
        <div className="gap-4 flex-col flex">
          <MtUiButton
            onClick={() => handleChoiceDb('local')}
            size="large"
            block
            className="bg-white h-12 border-primary text-primary"
          >
            <div className="w-full flex items-center justify-between">
              <p className="text-primary text-base font-medium">
                Current Device
              </p>
              <IconArrowRight />
            </div>
          </MtUiButton>
          <MtUiButton
            onClick={() => handleChoiceDb('server')}
            size="large"
            block
            className="bg-white h-12 border-primary text-primary"
          >
            <div className="w-full flex items-center justify-between">
              <p className="text-primary text-base font-medium">
                Previous Device
              </p>
              <IconArrowRight />
            </div>
          </MtUiButton>
        </div>
      </div>
    </DialogResponsive>
  );
};

export { SyncData };
