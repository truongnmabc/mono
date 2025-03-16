import {
  currentTestPlaying,
  fetchRecords,
  handleConvertSyncQuestion,
  handleConvertSyncReaction,
  handleConvertSyncTest,
  handleConvertSyncTopic,
} from './utils';

export const SyncUp = async ({
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

    const userActionStore = txWrite.objectStore('useActions');
    const topicsStore = txWrite.objectStore('topics');
    const testQuestionsStore = txWrite.objectStore('testQuestions');
    const questionsStore = txWrite.objectStore('questions');
    const userProgressStore = txWrite.objectStore('userProgress');
    const [tests, reactions, progress, topics] = await Promise.all([
      fetchRecords({
        objectStore: testQuestionsStore,
      }),
      fetchRecords({
        objectStore: userActionStore,
      }),
      fetchRecords({
        objectStore: userProgressStore,
      }),
      fetchRecords({
        objectStore: topicsStore,
      }),
    ]);
    const ids = progress?.map((item) => item.id) || [];
    const questions = await fetchRecords({
      objectStore: questionsStore,
      keys: ids,
    });

    const parentIdList = [...(progress || [])]
      .map((item) => item.selectedAnswers.map((ans: any) => ans.parentId))
      .flat();

    const uniqueParentIdList = [...new Set(parentIdList)];

    const listNotSync = progress?.filter((item) => !item.isSynced);
    console.log('🚀 ~ listNotSync:', listNotSync);

    const [
      TopicProgress,
      QuestionProgress,
      UserTestData,
      TestInfo,
      UserQuestionProgress,
    ] = await Promise.all([
      handleConvertSyncTopic({ topics, topicsStore }),
      handleConvertSyncReaction({
        userActionStore,
        reactions,
      }),
      currentTestPlaying({
        tests,
        progress,
      }),
      handleConvertSyncTest({
        appId,
        progress,
        questions,
        tests,
        uniqueParentIdList,
        userId,
      }),
      handleConvertSyncQuestion({
        questions: listNotSync,
        userProgressStore,
      }),
    ]);
    const payload = {
      appId,
      fixed: true,
      userId,
      user_data: {
        NewDailyGoal: [],
        NewStudyPlan: [],
        TestInfo: TestInfo,
        UserTestData: UserTestData,
        QuestionProgress: QuestionProgress,
        TopicProgress: TopicProgress,
        UserQuestionProgress: UserQuestionProgress,
        SyncKey: [syncKey],
      },
    };
    const response = await fetch(
      'https://micro-enigma-235001.appspot.com/api/app/flutter?type=set-user-data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    console.log('🚀 ~ data:', data);
  } catch (err) {
    console.log('🚀 ~ err:', err);
  }
};
