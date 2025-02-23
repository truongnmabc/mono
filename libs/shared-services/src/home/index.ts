import { axiosRequest } from '../config/axios';

export const sendEmailApi = async ({
  email,
  appName,
}: {
  email: string;
  appName: string;
}) => {
  try {
    return await axiosRequest({
      url: `/api/auth`,
      params: { type: 'send-email' },
      data: { email, appName },
      base: 'test',
    });
  } catch (error) {
    throw new Error(`Failed to send email`);
  }
};

export const verifiedCodeApi = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  try {
    return await axiosRequest({
      url: `/api/auth?type=verify-code`,
      data: {
        email,
        code,
      },
      params: {
        type: 'verify-code',
      },
      base: 'test',
    });
  } catch (error) {
    throw new Error(`Failed to verify code`);
  }
};

export const sendEmailSubscribe = async ({
  email,
  message,
  appName,
}: {
  email: string;
  message: string;
  appName: string;
}) => {
  try {
    return await axiosRequest({
      url: '/api/web',
      params: {
        type: 'send-email',
      },
      data: {
        subject: `Web ${appName} Support`,
        fromEmail: email,
        content: message,
      },
      base: 'test',
    });
  } catch (error) {
    throw new Error(`Failed to send email`);
  }
};

export const getAppReviewApi = async (appId: string) => {
  try {
    return await axiosRequest({
      url: 'ratings-reviews',
      params: { appID: appId },
      base: 'dashboard',
    });
  } catch (error) {
    throw new Error(`Failed to get app review`);
  }
};

export const getSEOAndHeaderContentApi = async (
  isHomePage: boolean,
  pathname?: string,
  isState?: boolean
) => {
  const url = 'wp-json/passemall/v1/get-seo-and-header-content';
  const result = await axiosRequest({
    url: url,
    method: 'post',
    data: {
      isHomePage,
      pathname,
      isState,
    },
  });

  return result;
};

export const sendEmailSubscribeApiV4 = async (
  email: string,
  message: string,
  appName: string
) => {
  try {
    const response = await axiosRequest({
      url: '/api/web',
      method: 'post',
      params: {
        type: 'send-email',
      },
      data: {
        subject: `Web ${appName} Support`,
        fromEmail: email,
        content: message,
      },
      base: 'test',
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to send email`);
  }
};
