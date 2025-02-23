import { axiosRequest } from '../config/axios';

export const requestUpdateUserDataToServer = (object: {
  app: string;
  price: number;
  email: string;
}) => {
  try {
    return axiosRequest({
      url: 'api/app/flutter',
      data: object,
      params: {
        type: 'set-user-data',
      },
      base: 'test',
    });
  } catch (err) {
    throw new Error(`Failed to save to dashboard`);
  }
};

export const syncDataToWebAfterLoginAPI = async () => {};
