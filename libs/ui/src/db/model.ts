import { IPassingModel } from '@ui/models/passing';
import { IPaymentInfos } from '@ui/models/payment';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionBase } from '@ui/models/question';
import { ITestBase } from '@ui/models/tests';
import { ITopicBase } from '@ui/models/topics';
import { IUserActions } from '@ui/models/user';
import Dexie, { Table } from 'dexie';

export class DB extends Dexie {
  userProgress!: Table<IUserQuestionProgress>;

  testQuestions!: Table<ITestBase>;

  paymentInfos!: Table<IPaymentInfos>;

  questions!: Table<IQuestionBase>;

  topics!: Table<ITopicBase>;

  useActions!: Table<IUserActions>;

  passingApp!: Table<IPassingModel>;

  constructor(appName: string) {
    super(appName);

    this.version(0.1).stores({
      userProgress: '++id,parentId',

      testQuestions: '++id,gameMode',

      paymentInfos: '++id,userId',

      //  Chứa thông tin câu hỏi của app
      questions: '++id,partId,subTopicId',

      //  chứa thông tin của mainTopic và subTopic
      topics: '++id,parentId,slug',

      // lưu thông tin bookmark, like của người dùng
      useActions: '++questionId',

      passingApp: '++id',
    });
  }
}

export let db: DB | null = null;

export const initializeDB = async (appShortName: string): Promise<DB> => {
  if (!db) {
    db = new DB(appShortName);

    try {
      await db.open(); // 🔥 Đảm bảo DB mở thành công
    } catch (error) {
      console.error('🚨 Lỗi mở IndexedDB:', error);
    }
  }
  return db;
};
