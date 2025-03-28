import { Button } from '@mui/material';
import { IAppInfo, IDevice } from '@ui/models/app';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';
import DrawerHeader from '../../drawer/drawerHeader';
import type { IBranchHomeJson, ITopicHomeJson } from '@ui/models/other';

type IProps = {
  appInfo: IAppInfo;
  device: IDevice;
  theme: 'light' | 'dark';
  seoData: {
    topics: ITopicHomeJson[];
    branch: IBranchHomeJson;
    finalTest: number;
  };
};
const IconMenuHeader = ({ appInfo, device, theme, seoData }: IProps) => {
  const [openMenuDrawer, setOpenMenuDrawer] = useState(false);
  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpenMenuDrawer(true);
        }}
        sx={{
          textTransform: 'capitalize',
          ':hover': {
            backgroundColor: 'transparent',
          },
        }}
        className="gap-3 "
      >
        <div
          className={clsx(
            'text-base font-normal hidden sm:block  cursor-pointer hover-main-color text-[#21212185]'
          )}
        >
          Menu
        </div>
        <div className="w-6 h-6 ">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.875 11H4.125C3.82663 11 3.54048 11.1054 3.32951 11.2929C3.11853 11.4804 3 11.7348 3 12C3 12.2652 3.11853 12.5196 3.32951 12.7071C3.54048 12.8946 3.82663 13 4.125 13H19.875C20.1734 13 20.4595 12.8946 20.6705 12.7071C20.8815 12.5196 21 12.2652 21 12C21 11.7348 20.8815 11.4804 20.6705 11.2929C20.4595 11.1054 20.1734 11 19.875 11Z"
              fill="#21212185"
            />
            <path
              d="M19.875 16H4.125C3.82663 16 3.54048 16.1054 3.32951 16.2929C3.11853 16.4804 3 16.7348 3 17C3 17.2652 3.11853 17.5196 3.32951 17.7071C3.54048 17.8946 3.82663 18 4.125 18H19.875C20.1734 18 20.4595 17.8946 20.6705 17.7071C20.8815 17.5196 21 17.2652 21 17C21 16.7348 20.8815 16.4804 20.6705 16.2929C20.4595 16.1054 20.1734 16 19.875 16Z"
              fill="#21212185"
            />
            <path
              d="M19.875 6H4.125C3.82663 6 3.54048 6.10536 3.32951 6.29289C3.11853 6.48043 3 6.73478 3 7C3 7.26522 3.11853 7.51957 3.32951 7.70711C3.54048 7.89464 3.82663 8 4.125 8H19.875C20.1734 8 20.4595 7.89464 20.6705 7.70711C20.8815 7.51957 21 7.26522 21 7C21 6.73478 20.8815 6.48043 20.6705 6.29289C20.4595 6.10536 20.1734 6 19.875 6Z"
              fill="#21212185"
            />
          </svg>
        </div>
      </Button>

      <DrawerHeader
        openMenuDrawer={openMenuDrawer}
        setOpenMenuDrawer={setOpenMenuDrawer}
        appInfo={appInfo}
        device={device}
        theme={theme}
        seoData={seoData}
      />
    </Fragment>
  );
};
export default React.memo(IconMenuHeader);
