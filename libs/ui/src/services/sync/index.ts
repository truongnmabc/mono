import { IPropsUpdateDataToServer, IPropsUpdateLogin } from '@ui/models/sync';
import { axiosRequest } from '../config/axios';
import { API_PATH } from '../constant';

export const updateLoginStatusAndCheckUserData = async ({
  payload,
}: {
  payload: IPropsUpdateLogin;
}) => {
  const result = await axiosRequest({
    url: `${API_PATH.UPDATE_LOGIN}`,
    params: {
      type: 'login-and-check-user-data',
    },
    method: 'post',
    data: payload,
    baseUrl: 'https://micro-enigma-235001.appspot.com/',
  });
  return result.data;
};

export const updateUserDataToServer = async (
  data: IPropsUpdateDataToServer
) => {
  const result = await axiosRequest({
    url: `${API_PATH.UPDATE_LOGIN}`,
    method: 'post',
    params: {
      type: 'set-user-data',
    },
    data: { ...data },
    baseUrl: 'https://micro-enigma-235001.appspot.com/',
  });
  return result.data;
};

export const getAllUserDataFromServer = async (data: {}) => {
  const result = await axiosRequest({
    url: `${API_PATH.UPDATE_LOGIN}`,
    params: {
      type: 'get-user-data',
    },
    method: 'post',
    data: { ...data },
    baseUrl: 'https://micro-enigma-235001.appspot.com/',
  });
  return result.data;
};

export const getProAfterLogin = async ({
  email,
  appId,
}: {
  email: string;
  appId: number;
}) => {
  const result = await axiosRequest({
    method: 'post',
    url: '/api/auth',
    params: {
      type: 'sync-data-to-web-after-login',
      email,
      appId,
    },
    base: 'getPro',
  });
  return result.data;
};
