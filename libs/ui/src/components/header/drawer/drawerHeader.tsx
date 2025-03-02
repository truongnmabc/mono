import { Drawer } from '@mui/material';
import CloseIcon from '@ui/asset/icon/CloseIcon';
import IconLinkStoreApp from '@ui/components/iconLinkStoreApp';
import RouterApp from '@ui/constants/router.constant';
import { IAppInfo, IDevice } from '@ui/models/app';
import { IContentSeo } from '@ui/models/seo';
import { trackingEventGa4 } from '@ui/utils/event';
import React from 'react';
import ItemDrawerFullTest from './itemDrawer';
import ListBranchDrawer from './listBranch';
import ListStudyDrawer from './listStudy';
type IList = {
  handleClick: () => void;
  name: string;
  href: string;
};

const DrawerHeader = ({
  openMenuDrawer,
  setOpenMenuDrawer,
  appInfo,
  device,
  seoData,
}: {
  openMenuDrawer: boolean;
  setOpenMenuDrawer: (e: boolean) => void;
  appInfo: IAppInfo;
  device: IDevice;
  theme: 'light' | 'dark';
  seoData: {
    topics: Record<string, IContentSeo>;
    branch: Record<string, IContentSeo>;
  };
}) => {
  const isMobile =
    device === 'mobile' ||
    device === 'mobile-ios' ||
    device === 'mobile-android';
  const list: IList[] = [
    ...(isMobile
      ? [
          {
            name: 'Review',
            handleClick: () => {
              setOpenMenuDrawer(false);
            },
            href: RouterApp.Review,
          },
        ]
      : []),
    {
      name: 'Score Calculator',
      handleClick: () => {
        setOpenMenuDrawer(false);
      },
      href: process.env['NEXT_PUBLIC_API_URL'] + RouterApp.Score_Calculator,
    },
    {
      name: 'Study Guides',
      handleClick: () => {
        setOpenMenuDrawer(false);
      },
      href: process.env['NEXT_PUBLIC_API_URL'] + RouterApp.Study_Guides,
    },
    {
      name: 'Blog',
      handleClick: () => {
        setOpenMenuDrawer(false);
      },
      href: process.env['NEXT_PUBLIC_API_URL'] + RouterApp.Blog,
    },

    {
      name: 'Contact',
      handleClick: () => {
        setOpenMenuDrawer(false);
      },
      href: RouterApp.Contacts,
    },
  ];

  return (
    <Drawer
      open={openMenuDrawer}
      onClose={() => setOpenMenuDrawer(false)}
      anchor="right"
      sx={{
        width: { xs: '300px', sm: '456px' }, // Sử dụng Material-UI breakpoints
        '& .MuiDrawer-paper': {
          width: { xs: '300px', sm: '456px' },
        },
      }}
    >
      <div className="bg-theme-white flex flex-col   p-3 w-full h-full overflow-auto">
        <div
          className="p-2 rounded-full cursor-pointer w-fit h-fit hover:bg-[#2121211f]"
          onClick={() => setOpenMenuDrawer(false)}
        >
          <CloseIcon color="rgba(0, 0, 0, 0.87)" />
        </div>
        <ItemDrawerFullTest
          name={`Full ${appInfo?.appName} Practice Test`}
          handleClick={() => {
            setOpenMenuDrawer(false);
            trackingEventGa4({
              eventName: 'click_menu_full_test',
              value: {
                from: window.location.href,
              },
            });
          }}
          href={RouterApp.Final_test}
        />

        <ListStudyDrawer
          topics={seoData.topics}
          setOpenMenuDrawer={setOpenMenuDrawer}
          appShortName={appInfo.appShortName}
        />
        <ListBranchDrawer
          branch={seoData.branch}
          setOpenMenuDrawer={setOpenMenuDrawer}
          appShortName={appInfo.appShortName}
        />

        {list.map((item) => (
          <ItemDrawerFullTest
            key={item.name}
            name={item.name}
            href={item.href}
            handleClick={item.handleClick}
          />
        ))}
        <div className="flex p-3 flex-col gap-2">
          <p className="text-sm  font-normal">
            Available on Android and Apple devices
          </p>
          <div className="flex items-center gap-2">
            <IconLinkStoreApp
              type="ios"
              classNames="w-[120px] h-[35px] sm:w-[120px] sm:h-[35px]"
              appInfo={appInfo}
            />
            <IconLinkStoreApp
              type="android"
              appInfo={appInfo}
              classNames="w-[120px] h-[35px] sm:w-[120px] sm:h-[35px]"
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default React.memo(DrawerHeader);
