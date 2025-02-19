import { requestGetData } from './request';
import { IMember, Member } from '@shared-models/memberContact';
export const getMemberApi = async (baseURL: string): Promise<IMember[]> => {
  try {
    const response = await requestGetData({
      config: {
        baseURL: baseURL,
        headers: {},
      },
      url: '/wp-json/passemall/v1/get-all-members',
    });
    if (Array.isArray(response)) {
      return response.map((item) => new Member(item));
    }
    console.error('Dữ liệu API không hợp lệ:', response);
    return [];
  } catch (error) {
    console.error('error call API:', error);
    return [];
  }
};
