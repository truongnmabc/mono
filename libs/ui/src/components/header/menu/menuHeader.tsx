import { IAppInfo, IDevice } from '@ui/models/app';
import React, { Fragment } from 'react';
import IconGetPro from './icon/iconGetPro';
import LoginHeader from './icon/iconLogin';
import IconMenuHeader from './icon/iconMenuHeader';
import IconReviewHeader from './icon/iconReview';
import IconTopics from './icon/iconTopics';
import type { IBranchHomeJson, ITopicHomeJson } from '@ui/models/other';

export interface IItemMenuHeader {
  name: string;
  icon?: React.ReactNode;
}

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

const MenuHeaderDesktop = ({ appInfo, device, theme, seoData }: IProps) => {
  const menus: IItemMenuHeader[] = [
    {
      name: 'Get Pro',
      icon: <IconGetPro />,
    },
    {
      name: 'Topics',
      icon: <IconTopics />,
    },
    {
      name: 'Review',
      icon: <IconReviewHeader />,
    },
    {
      name: 'Log in',
      icon: <LoginHeader />,
    },
    {
      name: 'Menu',
      icon: (
        <IconMenuHeader
          theme={theme}
          appInfo={appInfo}
          device={device}
          seoData={seoData}
        />
      ),
    },
  ];
  return (
    <div className="flex gap-4 md:gap-9 items-center justify-end">
      {menus?.map((item) => (
        <Fragment key={item.name}>{item.icon}</Fragment>
      ))}
    </div>
  );
};

export default MenuHeaderDesktop;
