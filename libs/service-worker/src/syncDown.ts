import { ITopicProgress } from './type';
import {
  convertTopicsFromServer,
  getYesterdayMidnightTimestamp,
  handleConvertQuestions,
  handleCreateNewTest,
  handleReaction,
} from './utils';
export const syncDown = async ({
  syncKey,
  appId,
  userId,
  db,
}: {
  syncKey: string;
  appId: number;
  userId: string;
  db: IDBDatabase;
}) => {
  try {
    const timestamp = getYesterdayMidnightTimestamp();

    const payload = {
      appId,
      userId,
      deleteOldData: false,
      user_data: {
        userId,
        syncKey,
        appId,
        mapUpdateData: {
          QuestionProgress: timestamp,
          UserQuestionProgress: timestamp,
          TestInfo: timestamp,
          UserTestData: timestamp,
          TopicProgress: timestamp,
        },
      },
    };

    const response = await fetch(
      'https://micro-enigma-235001.appspot.com/api/app/flutter?type=get-user-data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    // Kiểm tra status code
    if (!response.ok) {
      throw new Error(`Server trả về mã lỗi: ${response.status}`);
    }
    // Lấy dữ liệu từ server (nếu server trả JSON)
    const data = await response.json();
    const {
      UserQuestionProgress,
      TestInfo,
      QuestionProgress,
      TopicProgress,
      UserTestData,
    } = data;

    const txWrite = db.transaction(
      [
        'passingApp',
        'testQuestions',
        'topics',
        'questions',
        'useActions',
        'userProgress',
      ],
      'readwrite'
    );

    const topicsStore = txWrite.objectStore('topics');
    const userActionsStore = txWrite.objectStore('useActions');
    const testQuestionsStore = txWrite.objectStore('testQuestions');
    const questionsStore = txWrite.objectStore('questions');
    const userProgressStore = txWrite.objectStore('userProgress');

    await Promise.all([
      convertTopicsFromServer({
        TopicProgress: TopicProgress as ITopicProgress[],
        topicsStore,
      }),
      handleReaction({ QuestionProgress, userActionsStore }),
      handleCreateNewTest({
        TestInfo,
        UserTestData,
        testQuestionsStore,
        topicsStore,
      }),
      handleConvertQuestions({
        UserQuestionProgress,
        questionsStore,
        topicsStore,
        userProgressStore,
      }),
    ]);
  } catch (err) {
    console.error('syncDown error:', err);
    throw err;
  }
};
