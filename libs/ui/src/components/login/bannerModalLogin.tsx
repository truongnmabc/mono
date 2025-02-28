'use client';
import { useTheme } from '@ui/hooks/useTheme';
import { appInfoState } from '@ui/redux/features/appInfo';
import { useAppSelector } from '@ui/redux/store';
import { getImageSrc } from '@ui/utils/image';
import React from 'react';
import LazyLoadImage from '../images';

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);
  const { theme } = useTheme();

  return (
    <div className="w-full sm:w-1/2 sm:h-full pb-6 sm:pb-0 flex flex-col   ">
      <div className="w-full flex sm:hidden items-center gap-2 justify-center">
        <LazyLoadImage
          src={`/${appInfo.appShortName}/logo/${
            theme == 'dark' ? 'logo-dark' : 'logo-light'
          }.png`}
          alt="logoHeader"
          classNames=" max-h-[108px] h-6"
        />
      </div>
      <div className="flex flex-col z-10 sm:p-6 pt-6 sm:pt-0 gap-6">
        <div>
          <p className="text-2xl text-center sm:text-start leading-9 font-poppins font-semibold w-full  sm:max-w-[380px]">
            Pass on Your First Attempt With{' '}
            <span className="text-primary text-2xl leading-9 font-bold">
              {appInfo.appName} Prep!
            </span>
          </p>
        </div>
        <ul className="list-disc  pl-6 ">
          <li className="text-sm  text-[#212121]">
            <span className="text-sm font-medium leading-[21px]">
              Synchronize
            </span>{' '}
            among All devices
          </li>
          <li className="text-sm mt-3 text-[#212121]">
            <span className="text-sm font-medium leading-[21px]">
              {appInfo?.totalQuestion || 0 - (appInfo?.totalQuestion || 0 % 10)}
              +
            </span>{' '}
            free {appInfo.appName} Questions
          </li>
          <li className="text-sm mt-3 text-[#212121]">
            <span className="text-sm font-medium leading-[21px]">
              Smart & Fun
            </span>{' '}
            Learning Technique
          </li>
          <li className="text-sm mt-3 text-[#212121]">
            <span className="text-sm font-medium leading-[21px]">98% Pass</span>{' '}
            on the First Attempt
          </li>
        </ul>
      </div>
      <div className="flex-1 hidden sm:block">
        <LazyLoadImage
          classNames="h-full aspect-video flex-1"
          src={getImageSrc('login_banner.png')}
          alt="logoHeader"
        />
      </div>
    </div>
  );
};
const BannerModalLogin = React.memo(FN);
export default BannerModalLogin;
