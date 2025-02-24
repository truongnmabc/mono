'use client';
import { appInfoState } from '@ui/redux/features/appInfo';
import { useAppSelector } from '@ui/redux/store';
import LazyLoadImage from '@ui/components/images';
import React from 'react';
const TitleGetPro = () => {
  const { appInfo } = useAppSelector(appInfoState);
  return (
    <span className="text-[#59f5a9] ">
      {appInfo.appName}{' '}
      <span className="relative">
        Pro{' '}
        <LazyLoadImage
          classNames=" absolute -top-1 right-5 w-6 h-6"
          src="/images/passemall/new-pro/pro.png"
        />
      </span>
    </span>
  );
};

export default React.memo(TitleGetPro);
