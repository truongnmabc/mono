import { axiosRequest } from '../config/axios';
import { API_PATH, IGameType } from '../constant';

const appVersion = process.env['NEXT_PUBLIC_APP_VERSION'] || '0';
const dbVer = process.env['NEXT_PUBLIC_DB_VERSION'] || '0';

async function reportMistakeApi({
  appId,
  reasons,
  questionId,
  otherReason,
  gameType,
  userId,
  deviceId,
}: {
  appId: number;
  reasons: number[];
  questionId: number;
  otherReason?: string;
  gameType: IGameType;
  userId: number;
  deviceId?: string;
}) {
  try {
    const response = await axiosRequest({
      url: API_PATH.REPORT_MISTAKE,
      base: 'prop',
      data: {
        appId: appId,
        questionId: questionId,
        screenshot: '',
        reasons: otherReason && !reasons.length ? [7] : reasons,
        otherReason: otherReason,
        version: appVersion,
        dbVersion: dbVer,
        gameType: gameType,
        platform: 'web',
        userId: userId,
        deviceId: deviceId,
      },
      method: 'post',
    });
    return response.data;
  } catch (error) {
    console.error('Error reporting mistake:', error);
    throw error;
  }
}

export { reportMistakeApi };
