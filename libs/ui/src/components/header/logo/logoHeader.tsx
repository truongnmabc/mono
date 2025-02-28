import LazyLoadImage from '@ui/components/images';
import RouterApp from '@ui/constants/router.constant';
import { ITheme } from '@ui/models/app';
import { getImageSrc } from '@ui/utils/image';
import Link from 'next/link';
import React from 'react';
const LogoHeader = ({ theme }: { theme: ITheme }) => {
  return (
    <Link href={RouterApp.Home}>
      <div
        className="h-full max-h-10 w-full flex items-center cursor-pointer"
        data-testid="logoHeader"
      >
        <LazyLoadImage
          src={getImageSrc(
            theme == 'dark' ? 'logo-dark.png' : 'logo-light.png'
          )}
          alt="logoHeader"
          classNames=" w-full max-w-[128px] max-h-14 min-h-[40px] sm:max-w-[160px]"
        />
      </div>
    </Link>
  );
};
export default React.memo(LogoHeader);
