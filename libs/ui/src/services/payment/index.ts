import { axiosRequest } from '../config/axios';

export const updateUserInfoDashboard = async (args: {
  email: string;
  appShortName: string;
  appId: string;
  isBuy?: boolean;
  isSetupStudyPlan?: boolean;
  testDate?: string;
}) => {
  try {
    const result = await axiosRequest({
      url: 'buy-pro',
      data: args,
      method: 'post',
      base: 'dashboard',
    });
    return result.data;
  } catch (err) {
    console.log('🚀 ~ err:', err);
  }
};

export const uploadPaymentInfoAPI = async (object: Record<string, unknown>) => {
  try {
    const result = await axiosRequest({
      url: '/api/auth',
      params: {
        type: 'save-payment-info',
      },
      data: object,
      method: 'post',
      baseUrl: 'https://dev-dot-micro-enigma-235001.appspot.com',
    });
    return result.data;
  } catch (err) {
    console.log('🚀 ~ uploadPaymentInfoAPI ~ err:', err);
  }
};

export const saveToDashboardAPI = async (object: {
  app: string;
  price: number;
  email: string;
}) => {
  try {
    const result = await axiosRequest({
      url: 'pro-purchase-events',
      data: object,
      method: 'post',
      base: 'dashboard',
    });
    return result.data;
  } catch (err) {
    console.log('🚀 ~ err:', err);
  }
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
