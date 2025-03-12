import { axiosRequest } from '../config/axios';

export const updateUserInfoDashboard = (args: {
  email: string;
  appShortName: string;
  appId: string;
  isBuy?: boolean;
  isSetupStudyPlan?: boolean;
  testDate?: string;
}) => {
  return axiosRequest({
    url: 'buy-pro',
    data: args,
    method: 'post',
    base: 'dashboard',
  });
};

export const uploadPaymentInfoAPI = (object: Record<string, unknown>) => {
  return axiosRequest({
    url: '/api/auth?type=save-payment-info',
    data: object,
    method: 'post',
  });
};

export const saveToDashboardAPI = (object: {
  app: string;
  price: number;
  email: string;
}) => {
  return axiosRequest({
    url: 'pro-purchase-events/',
    data: object,
    method: 'post',
    base: 'dashboard',
  });
};

export const cancelSubscriptionAPI = async (orderId: string) => {
  try {
    const data = await axiosRequest({
      url: 'api/auth',
      params: {
        type: 'cancel-subscription',
        orderId: orderId,
        dev: process.env['NODE_ENV'] === 'development',
      },

      base: 'dev',
    });
    return data;
  } catch (error) {
    console.log('error', error);
    return undefined;
  }
};

export const sendEmailSubscribeSuccessAPI = async ({
  price,
  appName,
  email,
  name,
  timeExpiration,
  totalQuestion,
  emailSupport,
  learnPageSlug,
}: {
  appName?: string;
  price?: string;
  email?: string;
  timeExpiration?: Date;
  totalQuestion?: string;
  name?: string;
  emailSupport?: string;
  learnPageSlug?: string;
}) => {
  try {
    const website = window.location.origin;
    const learnPage = website + learnPageSlug;
    const billingPage = website + '/billing';
    const params = {
      learnPage,
      billingPage,
      emailSupport,
      website,
      price,
      email,
      totalQuestion,
      timeExpiration,
      name,
      appName: appName,
    };
    const data = await axiosRequest({
      url: 'api/auth?type=send-email-success-subscription',
      data: params,
      base: 'dev',
    });
    return data;
  } catch (error) {
    console.log('error', error);
    return undefined;
  }
};
