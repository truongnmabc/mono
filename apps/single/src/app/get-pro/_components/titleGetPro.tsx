'use client';
import { appInfoState } from '@shared-redux/features/appInfo';
import { useAppSelector } from '@shared-redux/store';
import LazyLoadImage from '@shared-uis/components/images';
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
