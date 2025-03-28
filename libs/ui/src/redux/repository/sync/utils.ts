import { GameTypeStatus, TypeConstTest, TypeParam } from '@ui/constants';
import { db } from '@ui/db';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IAnswer } from '@ui/models/question';
import {
  IQuestionProgressSync,
  ITopicProgress,
  TestInfo,
  UserQuestionProgress,
} from '@ui/models/sync';
import { ITestBase } from '@ui/models/tests';
import { IAction } from '@ui/models/user';
export const convertTopicsFromServer = async ({
  topicsSync,
}: {
  topicsSync: ITopicProgress[];
}) => {
  if (!topicsSync?.length) return;

  await Promise.all(
    topicsSync.map(
      async (topic) =>
        await db?.topics.update(topic.topicId, {
          status: topic?.progress === 1 ? 1 : 0,
        })
    )
  );
};

export const handleReaction = async (
  QuestionProgress?: IQuestionProgressSync[]
) => {
  if (!QuestionProgress?.length) return;

  const Ids = QuestionProgress.map((item) => item.questionId);
  const questions = await db?.questions.where('id').anyOf(Ids).toArray();

  const listMap = QuestionProgress.map((item) => {
    const question = questions?.find((q) => item.questionId === q.id);
    const actions: IAction = [];

    if (item.like === 1) actions.push('like');
    if (item.like === -1) actions.push('dislike');
    if (item.bookmark) actions.push('save');

    return {
      userId: -1,
      questionId: item.questionId,
      partId: question?.partId || -1,
      actions,
    };
  });

  await db?.useActions.bulkPut(listMap);
};

interface ITestQuestion {
  questionIds: number[];
  topicId: number;
  testId: number;
}

export const handleCreateNewTest = async ({
  TestInfo,
  UserTestData,
}: {
  TestInfo: TestInfo[];
  UserTestData: any[];
}) => {
  const listUpdate = TestInfo.length
    ? UserTestData.filter((item) =>
        TestInfo.some((test) => test.testId !== item.testId)
      )
    : UserTestData;
  for (const list of listUpdate) {
    await db?.testQuestions.update(list.testId, {
      status: list.status === 3 ? 1 : 0,
    });
  }
  const testPromises = TestInfo.map(async (item, index) => {
    const {
      testId,
      testQuestionNum,
      passPercent,
      type,
      testQuestionData,
      timeTest,
      testSettingId,
    } = item;
    const ques = (JSON.parse(testQuestionData) as ITestQuestion[]) || [];
    const currentTest = UserTestData.find(
      (test) => test.testId === item.testId
    );
    const topicIds = ques.map((q) => Number(q.topicId));
    const topics = await db?.topics.where('id').anyOf(topicIds).toArray();

    const groupExamData = ques?.map((q) => {
      return {
        topicId: Number(q.topicId),
        questionIds: q.questionIds.map((id) => Number(id)),
        totalQuestion: q.questionIds.length,
        topicName: topics?.find((t) => t.id === q.topicId)?.name,
      };
    });

    const data = {
      id: testId,
      index,
      totalDuration: timeTest / 60,
      isGamePaused: false,
      startTime: 0,
      elapsedTime: 0,
      gameMode: TypeConstTest[type],
      passingThreshold: passPercent,
      totalQuestion: Number(testQuestionNum),
      status: currentTest.status === 3 ? 1 : 0,
      attemptNumber: 1,
      topicIds,
      groupExamData,
      gameDifficultyLevel:
        testSettingId === 1
          ? 'newbie'
          : testSettingId === 2
          ? 'expert'
          : 'newbie',
      createDate: new Date().getTime(),
      sync: 1,
    } as ITestBase;
    await db?.testQuestions.put(data);
    return;
  });

  await Promise.all(testPromises);
};

interface Ix extends UserQuestionProgress {
  testIdOrTopicId: number;
}
export const handleConvertQuestions = async (UserQuestionProgress: Ix[]) => {
  const questionIds = UserQuestionProgress.map((item) => item.questionId);
  const [questions, progress] = await Promise.all([
    db?.questions.where('id').anyOf(questionIds).toArray(),
    db?.userProgress.where('id').anyOf(questionIds).toArray() || [],
  ]);

  const listMap = UserQuestionProgress.reduce((acc, item) => {
    const key = item.questionId;

    if (!acc[key]) {
      acc[key] = [];
    }
    if (acc[key].length > 0) {
      const currentQuestion = acc[key][0];
      const questionInfo = questions?.find((q) => item.questionId === q.id);
      const aa = item?.choicesSelected
        ?.map((c) => {
          const answer = questionInfo?.answers.find((a) => a.id === c);
          if (answer) {
            return {
              ...answer,
              turn: 1,
              type:
                item.type === GameTypeStatus.learn
                  ? TypeParam.learn
                  : item.type === GameTypeStatus.practiceTests
                  ? TypeParam.practiceTests
                  : item.type === GameTypeStatus.finalTests
                  ? TypeParam.finalTests
                  : item.type === GameTypeStatus.diagnosticTest
                  ? TypeParam.diagnosticTest
                  : item.type === GameTypeStatus.customTests
                  ? TypeParam.customTests
                  : item.type === GameTypeStatus.branchTest
                  ? TypeParam.branchTest
                  : TypeParam.learn,
              parentId: item?.testIdOrTopicId,
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
        ?.map((c) => {
          const answer = questionInfo?.answers.find((a) => a.id === c);
          if (answer) {
            return {
              ...answer,
              turn: 1,
              parentId: item?.testIdOrTopicId,
              type:
                item.type === GameTypeStatus.learn
                  ? TypeParam.learn
                  : item.type === GameTypeStatus.practiceTests
                  ? TypeParam.practiceTests
                  : item.type === GameTypeStatus.finalTests
                  ? TypeParam.finalTests
                  : item.type === GameTypeStatus.diagnosticTest
                  ? TypeParam.diagnosticTest
                  : item.type === GameTypeStatus.customTests
                  ? TypeParam.customTests
                  : item.type === GameTypeStatus.branchTest
                  ? TypeParam.branchTest
                  : TypeParam.review,
              isSynced: true,
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
        isSynced: true,
      };

      acc[key].push(question);
    }
    return acc;
  }, {} as Record<string, IUserQuestionProgress[]>);

  const useQuestion = Object.values(listMap).flat();

  const progressMap = new Map<number, IUserQuestionProgress>(
    progress.map((item) => [item.id, item])
  );

  // Mảng kết quả cuối cùng
  const finalData: IUserQuestionProgress[] = [];

  // 1. Duyệt "useQuestion" để MERGE
  for (const newRecord of useQuestion) {
    const existing = progressMap.get(newRecord.id);
    if (existing) {
      // Nếu đã có => gộp selectedAnswers
      existing.selectedAnswers = mergeAnswers({
        oldAnswers: existing.selectedAnswers,
        newAnswers: newRecord.selectedAnswers,
      });
      progressMap.set(newRecord.id, existing); // ghi đè lại
    } else {
      // Nếu chưa có, thêm mới
      progressMap.set(newRecord.id, newRecord);
    }
  }

  // 2. Chuyển progressMap => finalData
  for (const record of progressMap.values()) {
    finalData.push(record);
  }

  // 3. Lưu finalData vào userProgress
  await db?.userProgress.bulkPut(finalData);
};

export const findDuplicates = <T>(array: T[]): T[] => {
  const seen = new Set<T>();
  const duplicates = new Set<T>();

  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
};

const mergeAnswers = ({
  oldAnswers = [],
  newAnswers = [],
}: {
  oldAnswers: any[];
  newAnswers: any[];
}): IAnswer[] => {
  // Tạo mảng kết quả (shallow copy để tránh mutate)
  const merged: IAnswer[] = [...oldAnswers];

  for (const newAns of newAnswers) {
    // Tìm xem trong merged đã có answer trùng ID chưa
    const idx = merged.findIndex((oldAns) => oldAns.id === newAns.id);
    if (idx >= 0) {
      // Nếu đã có -> tùy ý cập nhật:
      // Ví dụ: update toàn bộ field (ghi đè),
      // hoặc chỉ update turn/parentId
      merged[idx] = {
        ...merged[idx],
        ...newAns,
        // Giữ lại oldAns.someField nếu muốn
      };
    } else {
      // Nếu chưa có -> thêm mới
      merged.push(newAns);
    }
  }

  return merged;
};
