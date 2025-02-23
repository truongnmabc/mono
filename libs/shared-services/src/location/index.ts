import { axiosRequest } from '../config/axios';

export interface CountryResponse {
  country: string;
  region: string;
  city: string;
  cityLatLong: string;
  userIP: string;
}

export const getCountryAPI = async (): Promise<CountryResponse | null> => {
  try {
    const response = await axiosRequest({
      method: 'get',
      url: '/get-country',
      baseUrl: 'https://us-east4-micro-enigma-235001.cloudfunctions.net',
    });
    return response.data;
  } catch (error) {
    console.error('Error in getCountryAPI:', error);
    return null;
  }
};

export const getIpFromServer = async (): Promise<string | null> => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();
    return ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
};
