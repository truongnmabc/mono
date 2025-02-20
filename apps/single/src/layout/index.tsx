'use client';
import { handleRegisterServiceWorker, initializeDB } from '@shared-db';
import { setIsDataFetched } from '@shared-redux/features/appInfo';
import { useAppDispatch } from '@shared-redux/store';
import EventListener from '@shared-uis/components/event';
import InitPassing from '@shared-uis/components/passing/initPassing';
import AppThemeProvider from '@shared-uis/components/theme';
import { API_PATH } from 'libs/constants/api.constants';
import { Fragment, useLayoutEffect } from 'react';
import appConfig from '../data/appConfig.json';
import appInfos from '../data/appInfos.json';
import StoreProvider from './StoreProvider';
import AppLayoutClient from './appLayoutClient';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider appInfo={appInfos} appConfig={appConfig}>
      <Wraper>{children}</Wraper>
    </StoreProvider>
  );
}

const Wraper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    if (appInfos) {
      initializeDB(appInfos.appShortName);
      handleRegisterServiceWorker({
        appShortName: appInfos.appShortName,
        API_PATH: API_PATH,
        onSuccess: () => {
          console.log('🚀 ~ onSuccess ~ onSuccess:');
          dispatch(setIsDataFetched(true));
        },
      });
    }
  }, [appInfos]);

  return (
    <Fragment>
      <AppThemeProvider appConfig={appConfig}>
        <AppLayoutClient appInfo={appInfos}>{children}</AppLayoutClient>
        <InitPassing />
        <EventListener dispatch={dispatch} />
      </AppThemeProvider>
    </Fragment>
  );
};
