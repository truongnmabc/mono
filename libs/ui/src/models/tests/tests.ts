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

export type IGameMode =
  | 'finalTests'
  | 'practiceTests'
  | 'diagnosticTest'
  | 'customTets'
  | 'learn';

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
}
