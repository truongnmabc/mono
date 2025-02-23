import { IAppInfo } from '@shared-models/app';
import AdsSense from '@shared-uis/components/ads/adsSense';
import AdsBlockerDetect from '@shared-uis/components/ads/detectAdsBlocker';
import AuthProvider from '@shared-uis/components/appLayout/authProvider';
import WrapperScroll from '@shared-uis/components/appLayout/wrapperScroll';
import PopupSubscription from '@shared-uis/components/checkSubscription';
import FooterApp from '@shared-uis/components/footer';
import HeaderApp from '@shared-uis/components/header';
import { NavigationEvents } from '@shared-uis/components/progressBar/navigationEvents';
import { ProgressBar } from '@shared-uis/components/progressBar/progressBar';
import SheetApp from '@shared-uis/components/sheetApp';
import SyncData from '@shared-uis/components/sync';
import React from 'react';
import { ToastContainer } from 'react-toastify';

const AppLayoutClient = ({
  children,
  appInfo,
}: {
  children: React.ReactNode;
  appInfo: IAppInfo;
}) => {
  return (
    <WrapperScroll>
      {/* <ProgressBar className="fixed z-50 top-0 h-1 bg-sky-500">
        <NavigationEvents />
      </ProgressBar>
      <HeaderApp appInfo={appInfo} /> */}
      <div className="flex-1 flex flex-col bg-theme-white dark:bg-theme-dark  justify-between">
        {children}
        {/* <FooterApp /> */}
      </div>
      {/* <ToastContainer autoClose={2000} />
      <SheetApp />
      <AuthProvider />
      <SyncData />
      <PopupSubscription />
      <AdsSense />
      <AdsBlockerDetect /> */}
    </WrapperScroll>
  );
};

export default React.memo(AppLayoutClient);
