'use client';

import { IAppConfigData, setAppConfig } from '@/redux/features/appConfig';
import { setAppInfo } from '@/redux/features/appInfo';
import { AppStore, makeStore } from '@/redux/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

import { IAppInfo } from '@ui/models/app';

export default function StoreProvider({
  children,
  appInfo,
  appConfig,
}: {
  children: React.ReactNode;
  appInfo: IAppInfo;
  appConfig?: IAppConfigData;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    if (appInfo) {
      storeRef.current.dispatch(setAppInfo(appInfo));
    }
    if (appConfig) {
      storeRef.current.dispatch(setAppConfig(appConfig));
    }
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
