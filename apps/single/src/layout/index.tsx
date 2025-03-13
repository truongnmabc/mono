'use client';
import EventListener from '@ui/components/event';
import FooterApp from '@ui/components/footer';
import HeaderApp from '@ui/components/header';
import AuthProvider from '@ui/components/layout/authProvider';
import WrapperScroll from '@ui/components/layout/wrapperScroll';
import { NavigationEvents } from '@ui/components/progressBar/navigationEvents';
import { ProgressBar } from '@ui/components/progressBar/progressBar';
import { SyncData } from '@ui/components/sync';
import AppThemeProvider from '@ui/components/theme';
import { initializeDB } from '@ui/db';
import { IDevice } from '@ui/models/app';
import { IBranchHomeJson, ITopicHomeJson } from '@ui/models/other';
import { setIsDataFetched } from '@ui/redux/features/appInfo';
import { useAppDispatch } from '@ui/redux/store';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import appConfig from '../data/appConfig.json';
import appInfos from '../data/appInfos.json';
import { useScreenResize } from './resize';
import StoreProvider from './StoreProvider';
import AdsBlockerDetect from '@ui/components/ads/detectAdsBlocker';
import AdsSense from '@ui/components/ads/adsSense';
import PopupSubscription from '@ui/components/checkSubscription';
import SheetApp from '@ui/components/sheetApp';
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
    finalTest: number;
  };
}) {
  useScreenResize();
  return (
    <StoreProvider appInfo={appInfos} appConfig={appConfig}>
      <AppThemeProvider appConfig={appConfig}>
        <WrapperScroll>
          <ProgressBar className="fixed z-50 w-full top-0 left-0 right-0 h-1 bg-sky-500">
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
            <FooterApp
              theme={theme}
              isMobile={device.includes('mobile')}
              appInfo={appInfos}
              appConfig={appConfig}
            />
          </div>
          <AuthProvider />
        </WrapperScroll>
        <ToastContainer autoClose={2000} />
        <SyncData appInfos={appInfos} />

        <SheetApp />
        <PopupSubscription />
        <AdsSense />
        <AdsBlockerDetect />

        <EventListener />
        <IniDexieIndexDb />
      </AppThemeProvider>
    </StoreProvider>
  );
}

const IniDexieIndexDb = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleInitDbDexie = async () => {
      await initializeDB(appInfos.appShortName);
      dispatch(setIsDataFetched(true));
    };
    if (appInfos) handleInitDbDexie();
  }, [appInfos]);

  return null;
};
