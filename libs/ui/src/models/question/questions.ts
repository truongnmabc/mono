import { IGameMode } from '../tests/tests';

export type IStatusAnswer =
  | 'incorrect'
  | 'correct'
  | 'learning'
  | 'review'
  | 'new'
  | 'skip';

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
}
export interface IParagraph {
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
  index?: number;
}

export interface IQuestionOpt extends IQuestionBase {
  localStatus?: IStatusAnswer;
  selectedAnswer?: IAnswer | null;
  turn?: number;
}
