import { db } from '@ui/db';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IAnswer } from '@ui/models/question';
import { ITestBase } from '@ui/models/tests';
import { ITopicBase } from '@ui/models/topics';
import { IAction } from '@ui/models/user';
import { RootState } from '@ui/redux/store';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUserDataFromServer, ITopicProgress } from '@ui/services/sync';

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

interface ITestQuestion {
  questionIds: number[];
  topicId: number;
  testId: number;
}

export const syncDown = createAsyncThunk('syncDown', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const { appInfo } = state.appInfo;
  const { userInfo } = state.user;

  const data = (await getAllUserDataFromServer({
    appId: appInfo.appId,
    userId: userInfo.email,
    deleteOldData: false,
  })) as unknown as IResponseSyncDown;

  const topics = (await db?.topics.toArray()) || [];

  if (data) {
    const { UserQuestionProgress, TestInfo, QuestionProgress, TopicProgress } =
      data;

    await handleQuestions(UserQuestionProgress);

    // topicId đang là short id nên chưa đúng. Đợi BE check lại
    await handleTestInfo(TestInfo, topics);

    // DONE
    await handleReaction(QuestionProgress);
    // DONE
    await handleTopicProgress({
      topicsSync: TopicProgress,
      topics,
    });
  }
});

const handleQuestions = async (
  UserQuestionProgress: UserQuestionProgress[]
) => {
  const questionIds = UserQuestionProgress.map((item) => item.questionId);
  const questions = await db?.questions
    .where('id')
    .anyOf(questionIds)
    .toArray();

  const listMap = UserQuestionProgress.reduce((acc, item) => {
    const key = item.questionId;

    if (!acc[key]) {
      acc[key] = [];
    }
    if (acc[key].length > 0) {
      const currentQuestion = acc[key][0];
      const questionInfo = questions?.find((q) => item.questionId === q.id);
      const aa = item.choicesSelected
        .map((c) => {
          const answer = questionInfo?.answers.find((a) => a.id === c);
          if (answer) {
            return {
              ...answer,
              turn: 1,
              parentId: item.parentId,
            };
          }
          return null;
        })
        .filter((answer): answer is IAnswer => answer !== null);

      const selectedAnswers = [...currentQuestion.selectedAnswers, ...aa];

      const question: IUserQuestionProgress = {
        ...currentQuestion,
        selectedAnswers: selectedAnswers || [],
      };
      acc[key] = [question];
    } else {
      const questionInfo = questions?.find((q) => item.questionId === q.id);
      const selectedAnswers = item.choicesSelected
        .map((c) => {
          const answer = questionInfo?.answers.find((a) => a.id === c);
          if (answer) {
            return {
              ...answer,
              turn: 1,
              parentId: item.parentId,
            };
          }
          return null;
        })
        .filter((answer): answer is IAnswer => answer !== null);

      const question: IUserQuestionProgress = {
        id: item.questionId,
        parentId: questionInfo?.partId || -1,
        level: questionInfo?.level || -1,
        selectedAnswers: selectedAnswers || [],
      };

      acc[key].push(question);
    }
    return acc;
  }, {} as Record<string, IUserQuestionProgress[]>);

  const useQuestion = Object.values(listMap).flat();

  await db?.userProgress.bulkPut(useQuestion);
};

const handleTestInfo = async (TestInfo: TestInfo[], topics: ITopicBase[]) => {
  for (const item of TestInfo) {
    const { testId, testQuestionNum, passPercent, testQuestionData } = item;
    const ques = JSON.parse(testQuestionData) as ITestQuestion[];
    const topicIds = ques.map((item) => Number(item.topicId));

    const groupExamData = ques.map((item) => {
      return {
        topicId: Number(item.topicId),
        questionIds: item.questionIds.map((q) => Number(q)),
        totalQuestion: item.questionIds.length,
        topicName: topics?.find((t) => t.id === item.topicId)?.name,
      };
    });
    const testQues: ITestBase = {
      id: testId,
      totalDuration: 1,
      isGamePaused: false,
      startTime: 0,
      elapsedTime: 0,
      gameMode: 'diagnosticTest',
      passingThreshold: passPercent,
      totalQuestion: Number(testQuestionNum),
      status: 0,
      attemptNumber: 1,
      topicIds: topicIds,
      groupExamData: groupExamData,
      createDate: new Date().getTime(),
    };
    await db?.testQuestions.add(testQues);
  }
};

const handleReaction = async (QuestionProgress?: IQuestionProgressSync[]) => {
  if (QuestionProgress?.length) {
    const Ids = QuestionProgress?.map((item) => item.questionId) || [];
    const questions = await db?.questions.where('id').anyOf(Ids).toArray();
    const listMap = QuestionProgress?.map((item) => {
      const question = questions?.find((q) => item.questionId === q.id);
      const actions = [];

      if (item.like === 1) {
        actions.push('like');
      }
      if (item.like === -1) {
        actions.push('dislike');
      }
      if (item.bookmark) {
        actions.push('save');
      }
      return {
        userId: -1,
        questionId: item.questionId,
        partId: question?.partId || -1,
        actions: actions as IAction,
      };
    });
    await db?.useActions.bulkPut(listMap);
  }
};

// TopicProgress  trả về sễ gồm core đang làm và topic đang làm
const handleTopicProgress = async ({
  topics,
  topicsSync,
}: {
  topicsSync?: ITopicProgress[];
  topics: ITopicBase[];
}) => {
  const currentTopic = topics.filter((item) =>
    topicsSync?.some((t) => t.topicId === item.id)
  );

  // khi tất cả core hoàn thành thì status subtupic là 1, tương tự với main
  for (const item of currentTopic) {
    await db?.topics
      .where('id')
      .equals(item.id)
      .modify((item) => {
        item.topics = item.topics.map((subTopic) => {
          // Cập nhật cores trong subtopic
          const updatedCores = subTopic.topics.map((core) => {
            const topicSync = topicsSync?.find((t) => t.topicId === core.id);
            return {
              ...core,
              status: topicSync?.progress === 1 ? 1 : 0,
            };
          });

          // Kiểm tra nếu tất cả cores hoàn thành thì cập nhật status của subtopic
          const isSubtopicCompleted = updatedCores.every(
            (core) => core.status === 1
          );

          return {
            ...subTopic,
            topics: updatedCores,
            status: isSubtopicCompleted ? 1 : 0,
          };
        });

        // Kiểm tra nếu tất cả subtopics hoàn thành thì cập nhật status của main topic
        const isMainTopicCompleted = item.topics.every(
          (subTopic) => subTopic.status === 1
        );
        item.status = isMainTopicCompleted ? 1 : 0;
      });
  }
};
