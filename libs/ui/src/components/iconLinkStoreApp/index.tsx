import { IAppInfo } from '@ui/models/app';
import { trackingEventGa4 } from '@ui/utils/event';
import ctx from '@ui/utils/twClass';
import Link from 'next/link';
import React from 'react';
import LazyLoadImage from '../images';

const IconLinkStoreApp = ({
  type,
  classNames,
  appInfo,
}: {
  type: 'ios' | 'android';
  classNames?: string;
  appInfo: IAppInfo;
}) => {
  const link = type === 'ios' ? appInfo.linkIos : appInfo.linkAndroid;
  return (
    <Link href={link} target="_blank">
      <LazyLoadImage
        src={
          type === 'ios'
            ? '/images/download/download_ios.webp'
            : '/images/download/download_android.webp'
        }
        classNames={ctx(
          'icon-download-app  h-[20px] sm:w-[180px] cursor-pointer sm:h-[50px]',
          classNames
        )}
        onClick={() => {
          trackingEventGa4({
            eventName: type === 'ios' ? 'click_app_store' : 'click_gg_store',
            value: {},
          });
        }}
      />
    </Link>
  );
};

export default React.memo(IconLinkStoreApp);
