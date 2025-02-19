import { BASE_URL_PROP, IGameType } from 'libs/constants';
import { requestPostData } from './request';
import { API_PATH } from 'libs/constants/api.constants';
const appVersion = process.env['NEXT_PUBLIC_APP_VERSION'] || '0';
const dbVer = process.env['NEXT_PUBLIC_DB_VERSION'] || '0';

async function getIpFromServer(): Promise<string | null> {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();
    return ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
}

async function reportMistakeApi({
  appId,
  reasons,
  questionId,
  otherReason,
  gameType,
  userId,
}: {
  appId: number;
  reasons: number[];
  questionId: number;
  otherReason?: string;
  gameType: IGameType;
  userId: number;
}) {
  try {
    const deviceId = await getIpFromServer();
    const param = {
      appId: appId,
      questionId: questionId,
      screenshot: '',
      reasons: reasons,
      otherReason: otherReason,
      version: appVersion,
      dbVersion: dbVer,
      gameType: gameType,
      platform: 'web',
      userId: userId,
      deviceId: deviceId,
    };
    const response = await requestPostData({
      url: API_PATH.REPORT_MISTAKE,
      config: {
        baseURL: BASE_URL_PROP,
      },
      data: param,
    });
    return response;
  } catch (error) {
    console.error('Error reporting mistake:', error);
    throw error;
  }
}

export default reportMistakeApi;
