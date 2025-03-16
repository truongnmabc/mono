import { axiosRequest } from '../config/axios';
import { API_PATH } from '../constant';

export const saveToDashboardAPI = async ({
  app,
  price,
  email,
}: {
  app: string;
  price: number;
  email: string;
}) => {
  try {
    return await axiosRequest({
      url: API_PATH.SAVE_TO_DASHBOARD,
      method: 'post',
      data: { app, price, email },
      base: 'dashboard',
    });
  } catch (error) {
    throw new Error(`Failed to save to dashboard`);
  }
};

export const checkPaypalStatusAPI = async (orderId: string) => {
  try {
    const response = await axiosRequest({
      url: 'api/auth',
      base: 'test',
      params: {
        type: 'check-status-subcription',
        orderId,
        dev: process.env['NODE_ENV'] === 'development',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to check PayPal status`);
  }
};
