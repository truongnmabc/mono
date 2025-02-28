import { Grid2 } from '@mui/material';
import { IAppInfo, IDevice } from '@ui/models/app';
import { IContentSeo } from '@ui/models/seo';
import clsx from 'clsx';
import React from 'react';
import DownLoadApp from './download/downloadApp';
import LogoHeader from './logo/logoHeader';
import MenuHeader from './menu/menuHeader';

type IProps = {
  appInfo: IAppInfo;
  device: IDevice;
  type: 'single' | 'multi' | 'state';
  theme: 'light' | 'dark';
  seoData: {
    topics: Record<string, IContentSeo>;
    branch: Record<string, IContentSeo>;
  };
};
const HeaderApp = ({ appInfo, type, device, theme, seoData }: IProps) => {
  if (type === 'state') {
    return <div>State</div>;
  }
  if (type === 'multi') {
    return <div>Multi</div>;
  }
  return (
    <div className="w-full">
      <DownLoadApp appInfo={appInfo} theme={theme} device={device} />
      <div
        className={clsx(
          'h-fit w-full flex bg-white dark:bg-black border-b  border-[#e4e4e4] border-solid  justify-center '
        )}
        id="headerRootLayout"
      >
        <div className="py-2 w-full z-0 h-full max-w-page">
          <Grid2 container>
            <Grid2
              size={{
                xs: 8,
                sm: 4,
                md: 4,
              }}
            >
              <LogoHeader theme={theme} />
            </Grid2>
            <Grid2
              size={{
                xs: 4,
                sm: 8,
                md: 8,
              }}
            >
              <MenuHeader
                appInfo={appInfo}
                device={device}
                theme={theme}
                seoData={seoData}
              />
            </Grid2>
          </Grid2>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeaderApp);
