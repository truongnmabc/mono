'use client';
import { appInfoState } from '@ui/redux/features/appInfo';
import { useAppSelector } from '@ui/redux/store';
import LazyLoadImage from '@ui/components/images';
import React from 'react';

const TotalQuestion = () => {
  const { appInfo } = useAppSelector(appInfoState);
  return (
    <div className="flex items-center gap-2 text-sm sm:text-base lg:text-lg capitalize text-center text-white">
      <LazyLoadImage
        classNames="w-8 h-8 sm:w-10 sm:h-10 lg:w-[50px] lg:h-[50px]"
        src="/images/passemall/new-pro/Checkbox.png"
      />
      Get {appInfo.totalQuestion}+ Questions On Mobile App
    </div>
  );
};

export default React.memo(TotalQuestion);
