import { createAsyncThunk } from '@reduxjs/toolkit';
import { GameTypeStatus } from '@ui/constants';
import { db } from '@ui/db';
import { IQuestionBase, ITestBase, ITopicBase, IUserActions } from '@ui/models';
import { IUserQuestionProgress } from '@ui/models/progress';
import { RootState } from '@ui/redux/store';
import { updateUserDataToServer } from '@ui/services/sync';
export const syncUp = createAsyncThunk('syncUp', async ({}: {}, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const { appInfo } = state.appInfo;
  const { userInfo } = state.user;
  const [tests, reactions, progress, topics] = await Promise.all([
    db?.testQuestions.toArray(),
    db?.useActions.toArray(),
    db?.userProgress.toArray(),
    db?.topics.toArray(),
  ]);

  const ids = progress?.map((item) => item.id) || [];
  const questions = await db?.questions.where('id').anyOf(ids).toArray();

  const parentIdList = [...(progress || [])]
    .map((item) => item.selectedAnswers.map((ans) => ans.parentId))
    .flat(); // Dùng flat() để loại bỏ mảng lồng nhau

  const uniqueParentIdList = [...new Set(parentIdList)];

  const TopicProgress = handleConverSyncTopic(topics);
  const QuestionProgress = handleConverSyncReaction(reactions);
  const UserTestData = handleConverSyncTest(
    tests,
    progress,
    questions,
    uniqueParentIdList
  );
  const UserQuestionProgress = handleConverSyncQuestion(progress);
  const result = await updateUserDataToServer({
    userId: userInfo.email,
    appId: appInfo.appId,
    platform: 'web',
    fixed: true,
    user_data: {
      NewDailyGoal: [],
      NewStudyPlan: [],
      UserTestData: UserTestData,
      QuestionProgress: QuestionProgress,
      TopicProgress: TopicProgress,
      UserQuestionProgress: UserQuestionProgress,
      SyncKey: ['UKQ1.231207.002'],
    },
  });
});
export interface ISyncTopics {
  progress: number;
  lastUpdate: number;
  lock: number;
  passed: number;
  longId: string;
  key: string;
  id: number;
}

const handleConverSyncTopic = (topics?: ITopicBase[]) => {
  const successTopics = topics?.filter((item) => item.status === 1);
  const syncTopics = successTopics?.map((t) => ({
    topicId: t.id,
    passed: 1,
    lock: 0,
    progress: 1,
    lastUpdate: new Date().getTime(),
  }));
  return syncTopics;
};

const handleConverSyncReaction = (reaction?: IUserActions[]) => {
  const syncReaction = reaction?.map((r) => ({
    bookmark: r.actions.includes('save'),
    questionId: r.questionId,
    like: r.actions.includes('dislike')
      ? -1
      : r.actions.includes('like')
      ? 1
      : 0,
    lastUpdate: new Date().getTime(),
    status: 1,
  }));

  return syncReaction;
};

const handleConverSyncTest = (
  test?: ITestBase[],
  progress?: IUserQuestionProgress[],
  questions?: IQuestionBase[],
  uniqueParentIdList?: number[]
) => {
  const testWithSync = test?.filter(
    (t) =>
      (t.gameMode === 'customTests' || t.gameMode === 'diagnosticTest') &&
      uniqueParentIdList?.includes(t.id)
  );
  if (testWithSync?.length === 0) return [];
  const syncTests = testWithSync?.map((t) => {
    const answ = progress
      ?.filter((item) => item.selectedAnswers.some((i) => i.parentId === t.id))
      .map((item) => ({
        ...item,
        selectedAnswers: item.selectedAnswers.filter(
          (i) => i.parentId === t.id
        ),
      }));

    const aa = answ?.reduce((acc, pre) => {
      const key = pre.id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(
        ...pre.selectedAnswers.map((i) => {
          const question = questions?.find((q) => q.id === pre.id);
          return {
            isCorrect: i.correct,
            id: i.id,
            text: question?.answers.find((a) => a.id === i.id)?.text,
            explanation: question?.answers.find((a) => a.id === i.id)
              ?.explanation,
          };
        })
      );
      return acc;
    }, {} as Record<string, any[]>);

    return {
      testId: t.id,
      testSettingId:
        t.gameDifficultyLevel === 'newbie'
          ? 1
          : t.gameDifficultyLevel === 'expert'
          ? 2
          : 3,
      status: t.gameMode === 'customTests' ? t.status : 1,
      totalQuestion: t.totalQuestion,
      correctNumber: answ?.filter((a) =>
        a.selectedAnswers.some((i) => i.correct)
      ).length,
      answeredQuestion: JSON.stringify(aa),
      lastUpdate: new Date().getTime(),
    };
  });
  return syncTests;
};

const handleConverSyncQuestion = (questions?: IUserQuestionProgress[]) => {
  if (!questions) return [];

  const groupedQuestions = questions.reduce((acc, q) => {
    q.selectedAnswers.forEach((a) => {
      const key = `${q.id}-${a.parentId}-${GameTypeStatus[a.type]}`;

      if (!acc[key]) {
        acc[key] = {
          histories: [],
          questionId: q.id,
          playedTimes: [],
          type: GameTypeStatus[a.type],
          playing: 0,
          lastUpdate: new Date().getTime(),
          parentId: a.parentId,
          choicesSelected: [],
        };
      }

      // Gom nhóm histories (1 nếu đúng, 0 nếu sai)
      acc[key].histories.push(a.correct ? 1 : 0);

      // Gom nhóm choicesSelected, loại bỏ trùng lặp
      if (!acc[key].choicesSelected.includes(a.id)) {
        acc[key].choicesSelected.push(a.id);
      }

      // Gom nhóm playedTimes
      acc[key].playedTimes.push({
        startTime: a.startAt,
        endTime: a.endAt,
      });
    });

    return acc;
  }, {} as Record<string, any>);

  // Chuyển object về array và format playedTimes thành JSON string
  const syncQuestions = Object.values(groupedQuestions).map((q) => ({
    ...q,
    playedTimes: JSON.stringify(q.playedTimes),
  }));

  console.log('🚀 ~ handleConverSyncQuestion ~ syncQuestions:', syncQuestions);
  return syncQuestions;
};
