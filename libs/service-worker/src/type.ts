import { IGameMode } from './constant';

export interface IPropsGetAllUserDataFromServer {
  appId: number;
  databaseId?: number;
  userId: string;
  deviceId?: string;
  deleteOldData: boolean;
  // (true: xoá hết dữ liệu trên server đồng thời sync dữ liệu từ local lên, false: lấy dữ liệu từ server xuống),
  user_data?: {
    userId?: string;
    syncKey?: string;
    appId?: number;
    deviceId?: string;
    probabilityOfPassing?: number;
    mapUpdateData?: Record<string, number>;
    UserTestData?: IUserTestData[];
    QuestionProgress?: IQuestionProgressSync[];
    TopicProgress?: ITopicProgress[];
    UserQuestionProgress?: IUserQuestionProgressSync[];
    DailyGoal?: any[];
    StudyPlan?: any[];
    TestInfo?: any[];
  };
}

export type IPlayedTime = {
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
export interface IPropsUpdateLogin {
  email: string;
  name?: string;
  phoneNumber?: number;
  photoUrl?: string;
  appId: number;
  databaseId?: number;
  deviceId?: string;
  deviceName?: string;
  platform?: string;
  providerId?: string;
  providerData?: string;
  // (google.user.id | apple.user.id, mail),
}
export interface IPropsUpdateDataToServer {}

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

export interface IResponseSyncDown {
  UserQuestionProgress: UserQuestionProgress[];
  probabilityOfPassing: number;
  TopicProgress?: ITopicProgress[];
  UserTestData: UserTestDaum[];
  QuestionProgress?: IQuestionProgressSync[];
  syncKey: string;
  TestInfo: TestInfo[];
  userId: string;
}

export interface UserQuestionProgress {
  id: string;
  questionId: number;
  shortQuestionId: number;
  type: number;
  histories: number[];
  playedTimes: string;
  playing: boolean;
  lastUpdate: number;
  parentId: number;
  choicesSelected: number[];
  status: number;
  appId: number;
  stateId: number;
  userId: string;
  deviceId: string;
  testIdOrTopicId: number;
}

export interface UserTestDaum {
  id: string;
  testId: number;
  appId: number;
  userId: string;
  testSettingId: number;
  deviceId: string;
  shortId: number;
  time: number;
  status: number;
  index: number;
  answeredQuestion: string;
  totalQuestion: number;
  correctNumber: number;
  lastUpdate: number;
  createDate: number;
  longTestId: number;
  lock: number;
  passingPoint: number;
  longServerId: string;
}

export interface TestInfo {
  id: number;
  shortId: number;
  status: number;
  appId: number;
  subAppId: number;
  stateId: number;
  lastUpdate: number;
  testId: number;
  thumbnail: string;
  title: string;
  description: string;
  passPercent: number;
  requiredPass: number;
  testQuestionData: string;
  testQuestionNum: string;
  index: number;
  timeTest: number;
  testSettingId: number;
  topicId: number;
  userId: string;
  type: number;
  cardIds: number[];
  tag: string;
  deviceId: string;
  key: string;
  oldId: string;
  oldStateId: string;
  oldTopicId: string;
  oldTQId: string;
}
export interface IAnswer {
  correct: boolean;
  explanation: string;
  id: number;
  index: number;
  text: string;
  turn: number;
  parentId: number;
  type: IGameMode;
  startAt?: number;
  endAt?: number;
  isSynced: boolean;
}

export interface IUserQuestionProgress {
  selectedAnswers: Omit<IAnswer, 'explanation' | 'index' | 'text'>[];
  id: number;
  parentId: number;
  level: number;
  isSynced?: boolean;
}
export interface ITopicBase {
  id: number;
  parentId: number;
  name: string;
  icon: string;
  tag: string;
  // Nôị dung có phải do ai render ra không: 0 là không, 1 là có
  contentType: number;
  // topics: ITopicBase[];
  topics: [];
  slug?: string;
  //  Các phần của topic đã hoàn thành hết chưa
  status: number;
  //  level trung bình của  topic
  averageLevel: number;
  // Tổng số câu hỏi
  totalQuestion: number;
  turn: number;
  partId: number;
  index: string;
  type?: number;
  orderIndex: number;
  isSynced?: boolean;
}
export type IAction = ('like' | 'dislike' | 'save')[];
export interface IUserActions {
  userId: number;
  actions: IAction;
  questionId: number;
  isSynced?: boolean;
}

export interface ITest {
  id: number;
  lastUpdate: number;
  createDate: number;
  title: string;
  databaseId: number;
  appId: number;
  stateId: number;
  examFormatId: number;
  passingPercent: number;
  duration: number;
  totalQuestion: number;
  thumbnail: string;
  type: number;
  dataType: number;
  status: number;
  topicIds: number[];
  groupExamData: IGroupExam[];
  testType?: string;
}
export interface IGroupExam {
  groupId?: number;
  topicName?: string;
  topicId: number;
  passingPercent?: number;
  totalQuestion: number;
  duration?: number;
  examData?: IExamData[];
  questionIds: number[];
}
export interface IExamData {
  topicName: string;
  totalQuestion: number;
  required?: boolean;
  topicId: number;
  questionIds: number[];
  id: number;
}

export interface ITestInfo {
  slug: string; // lưu slug của bài test này
  appId: number; //
  id: string; //
  passPercent: number; //
  tag: string;
  timeTest: number;
  title: string;
  totalQuestion: number;
  stateTag: string;
  img: string;
}

export interface ITestBase {
  id: number;
  totalDuration: number;
  isGamePaused: boolean;
  startTime: number;
  remainingTime?: number;
  elapsedTime: number;
  gameMode: IGameMode;
  gameDifficultyLevel?: 'newbie' | 'expert' | 'exam';
  passingThreshold: number;
  totalQuestion: number;
  status: number;
  attemptNumber: number;
  topicIds: number[];
  groupExamData: IGroupExam[];
  createDate?: number;
  index?: number;
  sync?: 0 | 1;
}
export interface IQuestionBase {
  id: number;
  parentId: number;
  icon: string;
  contentType: number;
  tag: string;
  answers: IAnswer[];
  explanation: string;
  text: string;
  image: string;
  level: number;
  paragraphId: number;
  status: number;
  syncStatus?: number;
  paragraph?: IParagraph;
  partId: number;
  subTopicId: number;
  subTopicTag: string;
  topicId: number;
  index?: number;
}
export interface IParagraph {
  id: number;
  text: string;
  status?: number;
  contentType?: number;
  syncStatus?: number;
}
