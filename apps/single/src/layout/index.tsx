'use client';
import StoreProvider from '../redux/StoreProvider';
import appInfos from '../data/appInfos.json';
import appConfig from '../data/appConfig.json';
import { API_PATH } from 'libs/constants/api.constants';
import { Fragment, useLayoutEffect } from 'react';
import { initializeDB, handleRegisterServiceWorker } from '@shared-db';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    if (appInfos) {
      initializeDB(appInfos.appShortName);
      //   handleRegisterServiceWorker({
      //     appShortName: appInfos.appShortName,
      //     API_PATH: API_PATH,
      //     onSuccess: () => {
      //       console.log('Service Worker registered successfully');
      //     },
      //   });
    }
  }, [appInfos]);
  return (
    <main>
      {/* <InitDataStore appConfig={appConfig} appInfo={appInfo} />
            <ServiceWorkerInit appInfo={appInfo} />
            <InitPassing />
            <AppThemeProvider>
                <AppLayout>{children}</AppLayout>
                <EventListener />
            </AppThemeProvider> */}

      <StoreProvider appInfo={appInfos} appConfig={appConfig}>
        {children}
      </StoreProvider>
    </main>
  );
}
