import LazyLoadImage from '@ui/components/images';
import { IAppInfo } from '@ui/models/app';
import { getImageSrc } from '@ui/utils/image';
import Link from 'next/link';

const StoreLogoPro = ({
  appInfo,
  isMobile,
}: {
  appInfo: IAppInfo;
  isMobile: boolean;
}) => {
  const logoIos = getImageSrc('logo-ios.png');
  const logoIos1 = getImageSrc('logo-ios-1.png');
  const logoAndroid = getImageSrc('logo-android.png');
  const logoAndroid1 = getImageSrc('logo-android-1.png');
  const logoCenter = getImageSrc('logo-gg-top-1.png');
  const logoCenterMobile = getImageSrc('logo-gg-top-1-mobile.png');

  return (
    <div className="flex pt-6 sm:pt-9 pb-6  bg-[#F0EEE6]  items-center justify-center">
      <div className="flex items-center justify-center sm:gap-[72px] gap-4">
        <Link href={appInfo.linkAndroid} target="_blank">
          <div className="flex items-center flex-col sm:flex-row gap-2">
            <LazyLoadImage src={logoAndroid} classNames="h-6 sm:h-14" />
            <LazyLoadImage src={logoAndroid1} classNames="h-6 sm:h-14" />
          </div>
        </Link>
        {isMobile ? (
          <LazyLoadImage src={logoCenterMobile} classNames="h-12 w-16 " />
        ) : (
          <LazyLoadImage src={logoCenter} classNames="h-6 sm:h-14 w-fit" />
        )}

        <Link href={appInfo.linkIos} target="_blank">
          <div className="flex items-center flex-col sm:flex-row gap-2">
            <LazyLoadImage src={logoIos} classNames="h-6 sm:h-14" />
            <LazyLoadImage src={logoIos1} classNames="h-6 sm:h-14" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StoreLogoPro;
