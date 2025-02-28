import LazyLoadImage from '@ui/components/images';
import { IAppInfo, IDevice } from '@ui/models/app';
import { getImageSrc } from '@ui/utils/image';
import Link from 'next/link';
import React from 'react';
import './style.css';

const DownLoadApp = ({
  appInfo,
  theme,
  device,
}: {
  appInfo: IAppInfo;
  theme: 'light' | 'dark';
  device: IDevice;
}) => {
  const urlDownload = getImageSrc('mobile_app_promo_banner.png');
  return (
    <div
      className="bg-cover sm:hidden   blur-up bg-[position:0_-124px] transition-all w-full bg-white h-16  bg-no-repeat"
      style={{
        backgroundImage: `url(${urlDownload})`,
      }}
    >
      <div className="px-4 py-2 flex gap-2 items-center w-full h-full bg-[#7B705CCC]">
        <div className="flex-1  ">
          <LazyLoadImage
            src={getImageSrc(
              theme == 'dark' ? 'logo-dark.png' : 'logo-light.png'
            )}
            alt={'logo-' + appInfo.appShortName}
            classNames="h-5 w-16"
          />

          <div className="flex items-center text-[10px] gap-[2px]">
            <p className={'highlight-text'} />
          </div>
        </div>
        <Link
          href={device === 'mobile-ios' ? appInfo.linkIos : appInfo.linkAndroid}
        >
          <div className="px-3 py-[6px] rounded-full bg-primary text-white ">
            Get the App
          </div>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(DownLoadApp);
