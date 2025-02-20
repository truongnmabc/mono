'use client';

import { IAppConfigData, IAppInfo } from '@shared-models/app';
import { setAppConfig } from '@shared-redux/features/appConfig';
import { setAppInfo } from '@shared-redux/features/appInfo';
import { AppStore, baseStore } from '@shared-redux/store';
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
  const storeRef = useRef<AppStore>();
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
