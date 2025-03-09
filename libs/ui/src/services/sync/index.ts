import { axiosRequest } from '../config/axios';
import { API_PATH } from '../constant';

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
interface IPropsUpdateLogin {
  email: string;
  name?: string;
  phoneNumber?: number;
  photoUrl?: string;
  appId: number;
  databaseId?: number;
  deviceId?: string;
  deviceName?: string;
  platform?: 'web';
  providerId?: 'google' | 'apple' | 'mail';
  providerData?: string;
  // (google.user.id | apple.user.id, mail),
}

export const updateLoginStatusAndCheckUserData = async (
  data: IPropsUpdateLogin
) => {
  const result = await axiosRequest({
    url: `${API_PATH.UPDATE_LOGIN}?type=login-and-check-user-data`,
    method: 'post',
    data: { ...data },
    baseUrl: 'https://micro-enigma-235001.appspot.com/',
  });
  return result.data;
};
export interface IUserTestData {
  testId: number;
  userId: string;
  testSettingId: number;
  status: number;
  lastUpdate: number;
  createDate: number;
  time: number;
  totalQuestion: number;
  lock: number;
  correctNumber: number;
  longTestId: number;
  key: string;
  answeredQuestion: string;
  id?: number;
}
export interface IQuestionProgressSync {
  progress?: number[];
  testProgress?: number[];
  testLevel?: number[];
  timesAnswered?: number[];
  boxNum?: number;
  boxNumTest?: number;
  bookmark: number;
  isPlaying?: number;
  lastUpdate: number;
  like: number;
  longId: number;
  key?: string;
  id?: number;
  questionId: number;
}
export interface ITopicProgress {
  progress: number;
  isPlaying: number;
  lastUpdate: number;
  lock: number;
  familiar?: number;
  mastered?: number;
  notSeen?: number;
  passed?: number;
  longId: number;
  key: string;
  id: number;
  topicId: number;
}

type IPlayedTime = {
  startTime: number;
  endTime: number;
};
export interface IUserQuestionProgressSync {
  id?: number;
  questionId: number;
  shortQuestionId: number;
  type: number;
  histories: number[];
  playedTimes: IPlayedTime[];
  playing: number;
  lastUpdate: number;
  parentId: string;
  lastAnswer: number;
  choicesSelected: number[];
  key: string;
}

interface IPropsGetAllUserDataFromServer {
  appId: number;
  databaseId?: number;
  userId: string;
  deviceId?: string;
  deleteOldData: boolean;
  // (true: xoá hết dữ liệu trên server đồng thời sync dữ liệu từ local lên, false: lấy dữ liệu từ server xuống),
  user_data?: {
    userId: string;
    syncKey: string;
    appId: number;
    deviceId?: string;
    probabilityOfPassing: number;
    mapUpdateData: Record<string, boolean>;
    UserTestData: IUserTestData[];
    QuestionProgress: IQuestionProgressSync[];
    TopicProgress: ITopicProgress[];
    UserQuestionProgress: IUserQuestionProgressSync[];
    DailyGoal?: [];
    StudyPlan?: [];
    TestInfo: [];
  };
}

export const getAllUserDataFromServer = async (
  data: IPropsGetAllUserDataFromServer
) => {
  const result = await axiosRequest({
    url: `${API_PATH.UPDATE_LOGIN}?type=get-user-data`,
    method: 'post',
    data: { ...data },
    baseUrl: 'https://micro-enigma-235001.appspot.com/',
  });
  return result.data;
};
