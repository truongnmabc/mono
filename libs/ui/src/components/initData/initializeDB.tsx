'use client';

import { initializeDB } from '@ui/db';
import { IAppInfo } from '@ui/models/app';
import { useLayoutEffect } from 'react';

const InitializeDB = ({ appInfo }: { appInfo: IAppInfo }) => {
  useLayoutEffect(() => {
    if (appInfo) {
      initializeDB(appInfo.appShortName);
    }
  }, [appInfo]);

  return null;
};

export default InitializeDB;
