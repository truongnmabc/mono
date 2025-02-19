import { BASE_STORE_URL } from 'libs/constants';
import { requestGetData } from './request';

/**
 * Fetches application data from a predefined store URL.
 *
 * @param {string} [appShortName="asvab"] - The short name of the app to fetch data for.
 * @returns {Promise<any>} The fetched data.
 */

export const getDataAll = async (appShortName: string = 'asvab') => {
  const url = `/${appShortName}/web-data/all-data.json?t=${Date.now()}`;
  try {
    return await requestGetData({
      url,
      config: { baseURL: BASE_STORE_URL },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
