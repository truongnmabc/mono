'use client';

import { IAppConfigData, IAppInfo } from '@ui/models/app';
import { setAppConfig } from '@ui/redux/features/appConfig';
import { setAppInfo } from '@ui/redux/features/appInfo';
import { AppStore, baseStore } from '@ui/redux/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export default function StoreProvider({
  children,
  appInfo,
  appConfig,
}: {
  children: React.ReactNode;
  appInfo: IAppInfo;
  appConfig?: IAppConfigData;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = baseStore();
    if (appInfo) {
      storeRef.current.dispatch(setAppInfo(appInfo));
    }
    if (appConfig) {
      storeRef.current.dispatch(setAppConfig(appConfig));
    }
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
