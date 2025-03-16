'use client';
import { db } from '@ui/db';
import { IAppInfo } from '@ui/models';
import { selectIsDataFetched } from '@ui/redux/features/appInfo.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { syncDown } from '@ui/redux/repository/sync/syncDown';
import { syncUp } from '@ui/redux/repository/sync/syncUp';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import {
  getProAfterLogin,
  updateLoginStatusAndCheckUserData,
} from '@ui/services/sync';
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
    async (name: 'server' | 'local') => {
      try {
        dispatch(
          syncDown({
            syncKey: syncKey,
            deleteOldData: true,
            dbDir: name,
          })
        );
      } catch (err) {
        console.log('🚀 ~ handleChoiceDb ~ err:', err);
      } finally {
        setIsShowPopup(false);
      }
    },
    [syncKey]
  );
  useEffect(() => {
    if (!userInfo?.id || !appInfos) return;
    const handleSyncData = async () => {
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

      const [user, app, progress, billing] = await Promise.all([
        updateLoginStatusAndCheckUserData({
          payload,
        }),
        db?.passingApp.get(-1),
        db?.userProgress.toArray(),
        getProAfterLogin({
          appId: appInfos.appId,
          email: 'jay23ammonsiv@gmail.com',
          // email: userInfo.email,
        }),
      ]);
      console.log('🚀 ~ handleSyncData ~ billing:', billing);

      if (app?.syncKey && user.sync_key !== app.syncKey && progress?.length) {
        await db?.passingApp.update(-1, {
          syncKey: user.sync_key,
        });
        setSyncKey(user.sync_key);
        setIsShowPopup(true);
      } else if (!progress?.length) {
        await db?.passingApp.update(-1, {
          syncKey: user.sync_key,
        });
      }
      // if ('serviceWorker' in navigator) {
      //   try {
      //     const registration = await navigator.serviceWorker.register('/sw.js');
      //     registration?.active?.postMessage({
      //       type: !user.has_user_data ? 'SYNC_UP' : 'SYNC_DOWN',
      //       // type: 'SYNC_UP',
      //       payload: {
      //         syncKey: user.sync_key,
      //         appId: appInfos.appId,
      //         userId: userInfo.email,
      //       },
      //     });
      //     // if (app?.syncKey && user.sync_key === app.syncKey) {
      //     //   registration?.active?.postMessage({
      //     //     type: !user.has_user_data ? 'SYNC_UP' : 'SYNC_DOWN',
      //     //     payload: {
      //     //       syncKey: user.sync_key,
      //     //       appId: appInfos.appId,
      //     //       userId: userInfo.email,
      //     //     },
      //     //   });
      //     // }
      //   } catch (err) {
      //     console.error('Service Worker registration failed:', err);
      //   }
      // }
      const handlePayment = (userDeviceLogins: any) => {
        for (const userDeviceLogin of userDeviceLogins) {
          if (!userDeviceLogin) {
            continue;
          }
          const payment = {
            appId: userDeviceLogin.appId,
            userId: userDeviceLogin.userId,
            createdDate: new Date(userDeviceLogin.createdDate || '').getTime(),
            // updateDate: new Date(details.status_update_time || '').getTime(),
            emailAddress: userDeviceLogin.emailAddress,
            amount: userDeviceLogin.amount,
            orderId: userDeviceLogin.orderId || '',
            paymentStatus: userDeviceLogin.inAppPurchared == 1 ? 1 : 0,
            appShortName: appInfos.appShortName,
            // payerName: details.subscriber?.name?.given_name || '',
            // payerId: details.subscriber?.payer_id || '',
            // planId: details.plan_id,
            // planName: valueButton.type,
            status: userDeviceLogin.status,
            expiredDate: new Date(userDeviceLogin?.expiredDate).getTime(),
          };
          db?.paymentInfos.put(payment);
        }
      };

      handlePayment(billing.UserDeviceLogins);
      // server chưa có thông tin. up lên
      if (!user.has_user_data || !app)
        return dispatch(
          syncUp({
            syncKey: user.sync_key,
          })
        );

      // server có thông tin , local có thông tin, chọn db nào để sync
      if (app.syncKey && user.sync_key !== app.syncKey) {
        await db?.passingApp.update(-1, {
          syncKey: user.sync_key,
        });
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

  return (
    <DialogResponsive
      open={isShowPopup}
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
