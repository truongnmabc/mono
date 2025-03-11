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
  try {
    const [tests, reactions, progress, topics, app] = await Promise.all([
      db?.testQuestions.toArray(),
      db?.useActions.toArray(),
      db?.userProgress.toArray(),
      db?.topics.toArray(),
      db?.passingApp.get(-1),
    ]);

    const ids = progress?.map((item) => item.id) || [];
    const questions = await db?.questions.where('id').anyOf(ids).toArray();

    const parentIdList = [...(progress || [])]
      .map((item) => item.selectedAnswers.map((ans) => ans.parentId))
      .flat(); // Dùng flat() để loại bỏ mảng lồng nhau

    const uniqueParentIdList = [...new Set(parentIdList)];

    const TopicProgress = handleConvertSyncTopic(topics);
    const QuestionProgress = handleConvertSyncReaction(reactions);
    const TestInfo = handleConvertSyncTest(
      tests,
      progress,
      questions,
      uniqueParentIdList
    );
    const UserTestData = currentTestPlaying(tests, progress);
    const UserQuestionProgress = handleConvertSyncQuestion(progress);

    const result = await updateUserDataToServer({
      userId: userInfo.email,
      appId: appInfo.appId,
      platform: 'web',
      fixed: true,
      user_data: {
        NewDailyGoal: [],
        NewStudyPlan: [],
        TestInfo: TestInfo,
        UserTestData: UserTestData,
        QuestionProgress: QuestionProgress,
        TopicProgress: TopicProgress,
        UserQuestionProgress: UserQuestionProgress,
        SyncKey: [app?.syncKey],
      },
    });
  } catch (err) {
    console.log(err);
  }
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

const handleConvertSyncTopic = (topics?: ITopicBase[]) => {
  if (!topics) return [];

  const parentTopics = topics.filter((item) => item.type === 1);
  const subTopics = topics.filter((item) => item.type === 2);
  const parts = topics.filter(
    (item) => item.status === 1 && item.type === 3 && item.sync !== 1
  );

  const partSync = parts.map((t) => ({
    topicId: t.id,
    passed: 1,
    lock: 0,
    progress: 1,
    lastUpdate: Date.now(),
    type: t.type,
    parentId: t.parentId,
  }));

  const subTopicsInProgress = subTopics.filter((sub) =>
    parts.some((part) => part.parentId === sub.id)
  );

  const subSync = subTopicsInProgress.map((sub) => {
    const subParts = parts.filter((part) => part.parentId === sub.id);

    const totalParts =
      topics.filter((t) => t.parentId === sub.id && t.type === 3).length || 1;
    const progress = subParts.length / totalParts;

    return {
      topicId: sub.id,
      passed: progress === 1 ? 1 : 0,
      lock: 0,
      progress,
      type: sub.type,
      lastUpdate: Date.now(),
      parentId: sub.parentId,
    };
  });

  const parentSubTopics = parentTopics.filter((parent) =>
    subSync.some((sub) => sub.parentId === parent.id)
  );

  const parentSync = parentSubTopics.map((parent) => {
    const parentSubs = subSync.filter((sub) =>
      subTopics.some((t) => t.id === sub.topicId && t.parentId === parent.id)
    );

    const sub = topics.filter((t) => t.parentId === parent.id && t.type === 2);

    const core = topics.filter((t) => sub.some((s) => s.id === t.parentId));

    const progress = parentSubs.length / core.length;

    return {
      topicId: parent.id,
      passed: progress === 1 ? 1 : 0,
      lock: 0,
      progress,
      lastUpdate: Date.now(),
    };
  });

  return [...partSync, ...subSync, ...parentSync];
};

const handleConvertSyncReaction = (reaction?: IUserActions[]) => {
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

const currentTestPlaying = (
  tests?: ITestBase[],
  progress?: IUserQuestionProgress[]
) => {
  const syncTests = tests?.filter((t) =>
    progress?.some((p) => p.selectedAnswers.some((i) => i.parentId === t.id))
  );

  return syncTests?.map((t) => {
    const correct =
      progress?.filter((a) => a.selectedAnswers.some((i) => i.correct))
        .length || 0;
    return {
      testId: t.id,
      testSettingId:
        t.gameDifficultyLevel === 'newbie'
          ? 1
          : t.gameDifficultyLevel === 'expert'
          ? 2
          : 3,
      lock: 0,
      lastUpdate: new Date().getTime(),
      status: t.status === 1 ? 3 : correct > 0 ? 1 : 2,
      totalQuestion: t.totalQuestion,
      correctNumber: correct,
    };
  });
};

const handleConvertSyncTest = (
  tests?: ITestBase[],
  progress?: IUserQuestionProgress[],
  questions?: IQuestionBase[],
  uniqueParentIdList?: number[]
) => {
  const testWithSync = tests?.filter(
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
      shortId: t.id,
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
      type: 10,
      testQuestionData: JSON.stringify(aa),
      lastUpdate: new Date().getTime(),
    };
  });
  return syncTests;
};

const handleConvertSyncQuestion = (questions?: IUserQuestionProgress[]) => {
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
          testIdOrTopicId: a.parentId,
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

  return syncQuestions;
};
