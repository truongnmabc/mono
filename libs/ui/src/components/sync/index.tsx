'use client';
import { db } from '@ui/db';
import { IAppInfo } from '@ui/models';
import { selectIsDataFetched } from '@ui/redux/features/appInfo.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { syncDown } from '@ui/redux/repository/sync/syncDown';
import { syncUp } from '@ui/redux/repository/sync/syncUp';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { updateLoginStatusAndCheckUserData } from '@ui/services/sync';
import { useCallback, useEffect, useState } from 'react';
import { MtUiButton } from '../button';
import DialogResponsive from '../dialogResponsive';
import { IconArrowRight, SelectIconSync } from './icon';

const SyncData = ({ appInfos }: { appInfos: IAppInfo }) => {
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const isFetched = useAppSelector(selectIsDataFetched);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [syncKey, setSyncKey] = useState('');

  const handleChoiceDb = useCallback(
    async (name: string) => {
      try {
        if (name === 'local') {
          dispatch(
            syncUp({
              syncKey: syncKey,
            })
          );
        } else {
          dispatch(
            syncDown({
              syncKey: syncKey,
            })
          );
          // const result = await dispatch(clearDbLocalBeforeSync());
          // console.log('🚀 ~ result:', result);
          // if (result) {
          //   dispatch(
          //     syncDown({
          //       syncKey: syncKey,
          //     })
          //   );
          // }
        }
      } catch (err) {
        console.log('🚀 ~ handleChoiceDb ~ err:', err);
      } finally {
        setIsShowPopup(false);
      }
    },
    [syncKey]
  );
  useEffect(() => {
    const handleSyncData = async () => {
      if (!userInfo?.id || !appInfos) return;

      const payload = {
        appId: appInfos.appId,
        email: userInfo.email,
        name: userInfo.name,
        photoUrl: userInfo.image,
        phoneNumber: userInfo.phoneNumber,
        platform: 'web',
        providerId: 'google',
        providerData: userInfo.id,
      };

      const [user, app] = await Promise.all([
        updateLoginStatusAndCheckUserData({
          payload,
        }),
        db?.passingApp.get(-1),
      ]);

      if (app?.syncKey && user.sync_key !== app.syncKey) {
        await db?.passingApp.update(-1, {
          syncKey: user.sync_key,
        });
      }
      // server chưa có thông tin. up lên
      if (!user.has_user_data || !app)
        return dispatch(
          syncUp({
            syncKey: user.sync_key,
          })
        );

      // server có thông tin , local có thông tin, chọn db nào để sync
      if (app.syncKey && user.sync_key !== app.syncKey) {
        setSyncKey(user.sync_key);
        setIsShowPopup(true);
      } else {
        // server có thông tin còn local thì không
        dispatch(
          syncDown({
            syncKey: user.sync_key,
          })
        );
      }
      return;
    };
    if (isFetched) {
      setTimeout(() => {
        handleSyncData();
      }, 1000);
    }
  }, [isFetched, userInfo, appInfos]);
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
