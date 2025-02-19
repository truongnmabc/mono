import { BASE_URL, DASHBOARD_API } from 'libs/constants';
import { requestPostData } from './request';

export const saveUserInfoDashboard = (args: {
  email: string;
  appShortName: string;
  hourUTC: number;
  isBuy: boolean;
  appId: number;
  isSetupStudyPlan: boolean;
  testDate: string;
}) => {
  return requestPostData({
    url: 'web-login',
    data: args,
    config: {
      baseURL: DASHBOARD_API,
    },
  });
};
export const updateUserInfoDashboard = (args: {
  email: string;
  appShortName: string;
  appId: string;
  isBuy?: boolean;
  isSetupStudyPlan?: boolean;
  testDate?: string;
}) => {
  return requestPostData({
    config: {
      baseURL: DASHBOARD_API,
    },
    url: 'buy-pro',
    data: args,
  });
};

export function syncDataToWebAfterLoginAPI(data?: Record<string, unknown>) {
  //https://micro-enigma-235001.appspot.com/api/auth?type=send-email&email=tranhoang30101@gmail.com&appName=ASVAB
  return requestPostData({
    url: '/api/auth?type=sync-data-to-web-after-login',
    data,
    config: {
      baseURL: BASE_URL,
    },
  });
}
