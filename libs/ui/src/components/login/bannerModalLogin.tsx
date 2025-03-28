'use client';
import { useTheme } from '@ui/hooks/useTheme';
import { appInfoState } from '@ui/redux/features/appInfo';
import { useAppSelector } from '@ui/redux/store';
import { getImageSrc } from '@ui/utils/image';
import React from 'react';
import LazyLoadImage from '../images';

const FN = ({ setOpen }: { setOpen: (e: boolean) => void }) => {
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
          classNames=" max-h-[108px] flex-1 h-6"
        />
        <div
          className="w-6 h-6 sm:hidden bg-white rounded-full flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
              fill="#212121"
            />
          </svg>
        </div>
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
