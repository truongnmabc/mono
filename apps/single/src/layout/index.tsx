'use client';
import EventListener from '@ui/components/event';
import FooterApp from '@ui/components/footer';
import HeaderApp from '@ui/components/header';
import AuthProvider from '@ui/components/layout/authProvider';
import WrapperScroll from '@ui/components/layout/wrapperScroll';
import { NavigationEvents } from '@ui/components/progressBar/navigationEvents';
import { ProgressBar } from '@ui/components/progressBar/progressBar';
import AppThemeProvider from '@ui/components/theme';
import { initializeDB } from '@ui/db';
import { IDevice } from '@ui/models/app';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import appConfig from '../data/appConfig.json';
import appInfos from '../data/appInfos.json';
import StoreProvider from './StoreProvider';
import { IBranchHomeJson, ITopicHomeJson } from '@ui/models/other';

export default function RootLayout({
  children,
  device = 'desktop',
  theme = 'light',
  data,
}: {
  children: React.ReactNode;
  device?: IDevice;
  theme: 'light' | 'dark';
  data: {
    topics: ITopicHomeJson[];
    branch: IBranchHomeJson;
  };
}) {
  return (
    <StoreProvider appInfo={appInfos} appConfig={appConfig}>
      <AppThemeProvider appConfig={appConfig}>
        <WrapperScroll>
          <ProgressBar className="fixed z-50 top-0 h-1 bg-sky-500">
            <NavigationEvents />
          </ProgressBar>
          <HeaderApp
            type="single"
            appInfo={appInfos}
            device={device}
            theme={theme}
            seoData={data}
          />
          <div className="flex-1 flex flex-col bg-theme-white dark:bg-theme-dark  justify-between">
            {children}
            <FooterApp />
          </div>
          <AuthProvider />
        </WrapperScroll>
        <ToastContainer autoClose={2000} />

        {/* <SheetApp />
        <AuthProvider />
        <SyncData />
        <PopupSubscription />
        <AdsSense />
        <AdsBlockerDetect /> */}
        {/* <AuthProvider /> */}

        <EventListener />
        <IniDexieIndexDb />
      </AppThemeProvider>
    </StoreProvider>
  );
}

const IniDexieIndexDb = () => {
  useEffect(() => {
    if (appInfos) {
      initializeDB(appInfos.appShortName);
    }
  }, [appInfos]);

  return null;
};
