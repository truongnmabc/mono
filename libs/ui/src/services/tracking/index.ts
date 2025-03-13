import { API_PATH } from '@ui/constants/api.constants';
import { axiosRequest } from '../config/axios';

export const trackingAnswer = async () => {
  try {
    const reulst = await axiosRequest({
      base: 'tracking',
      url: API_PATH.TRACKING_PROGRESS,
    });
    return reulst.data;
  } catch (err) {
    console.log('🚀 ~ trackingAnswer ~ err:', err);
    return null;
  }
};

export const trackingReport = async () => {
  try {
    const reulst = await axiosRequest({
      base: 'tracking',
      url: API_PATH.TRACKING_REPORT,
    });

    return reulst.data;
  } catch (err) {
    console.log('🚀 ~ trackingReport ~ err:', err);
    return null;
  }
};
