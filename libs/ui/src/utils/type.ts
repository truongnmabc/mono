type IGameMode =
  | 'finalTests'
  | 'practiceTests'
  | 'diagnosticTest'
  | 'customTets'
  | 'learn';

interface IAnswer {
  correct: boolean;
  explanation: string;
  id: number;
  index: number;
  text: string;
  turn: number;
  parentId: number;
  type: IGameMode;
}
interface IParagraph {
  id: number;
  text: string;
  status?: number;
  contentType?: number;
  syncStatus?: number;
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
}

export interface ITopicBase {
  id: number;
  parentId: number;
  name: string;
  icon: string;
  tag: string;
  // Nôị dung có phải do ai render ra không: 0 là không, 1 là có
  contentType: number;
  topics: ITopicBase[];
  slug?: string;
  //  Các phần của topic đã hoàn thành hết chưa
  status: number;
  //  level trung bình của  topic
  averageLevel: number;
  // Tổng số câu hỏi
  totalQuestion: number;
  turn: number;
  partId: number;
}
export interface IAppInfo {
  appId: number;
  appName: string;
  appNameId: string;
  appShortName: string;
  bucket: string;
  categoryId: string;
  descriptionSEO: string;
  keywordSEO: string;
  linkAndroid: string;
  linkIos: string;
  link: string;
  rank_math_title: string;
  title: string;
  totalQuestion: number;
  usingFeaturePro: boolean;
  usingMathJax: boolean | string;
  hasState?: boolean;
  icon?: string;
  oneMonthPro?: { planId: string; price: number };
  oneWeekPro?: { planId: string; price: number };
  oneYearPro?: { planId: string; price: number };
  oneTimePro?: { planId: string; price: number };
}
