'use client';
import LazyLoadImage from '@shared-uis/components/images';
import { useTheme } from '@shared-uis/hooks';
import RouterApp from 'libs/constants/router.constant';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
const LogoHeader = ({ appShortName }: { appShortName: string }) => {
  const { push } = useRouter();
  const pathname = usePathname() || '';
  const { theme } = useTheme();
  return (
    <div
      className="h-full max-h-10 w-full flex items-center cursor-pointer"
      onClick={() => {
        if (pathname === RouterApp.Home) return;
        push(RouterApp.Home);
      }}
      data-testid="logoHeader"
    >
      <LazyLoadImage
        src={`/${appShortName}/logo/${
          theme == 'dark' ? 'logo-dark' : 'logo-light'
        }.png`}
        alt="logoHeader"
        classNames=" w-full max-w-[128px] max-h-14 min-h-[40px] sm:max-w-[160px]"
      />
    </div>
  );
};
export default React.memo(LogoHeader);
