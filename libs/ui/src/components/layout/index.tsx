import { IAppInfo } from '@ui/models/app';
import React from 'react';
import HeaderApp from '../header';
import { NavigationEvents } from '../progressBar/navigationEvents';
import { ProgressBar } from '../progressBar/progressBar';
import WrapperScroll from './wrapperScroll';

const FN = ({
  children,
  appInfo,
}: {
  children: React.ReactNode;
  appInfo: IAppInfo;
}) => {
  return (
    <WrapperScroll>
      <ProgressBar className="fixed z-50 top-0 h-1 bg-sky-500">
        <NavigationEvents />
      </ProgressBar>
      <HeaderApp appInfo={appInfo} />
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

const AppLayout = React.memo(FN);

export default AppLayout;
