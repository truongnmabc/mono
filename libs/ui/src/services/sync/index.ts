import {
  IPropsGetAllUserDataFromServer,
  IPropsUpdateDataToServer,
  IPropsUpdateLogin,
} from '@ui/models/sync';
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

export const getAllUserDataFromServer = async (
  data: IPropsGetAllUserDataFromServer
) => {
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
