import { db } from '@ui/db';
import { IGameMode } from '@ui/models/tests/tests';

type IPropsPracticeTest = {
  testId?: number;
  type: IGameMode;
};
const getData = async (type: string) => {
  const list = await db?.testQuestions
    .where('gameMode')
    .equals(type)
    .sortBy('index');

  const fistTest = list?.find((item) => item.status === 0);
  if (!fistTest) return list?.[list?.length - 1];
  return fistTest;
};
export const handleGetDataPracticeTest = async ({
  testId,
  type,
}: IPropsPracticeTest) => {
  const practice = !testId
    ? await getData(type)
    : await db?.testQuestions.get(testId);
  console.log('🚀 ~ practice:', practice);

  if (!practice || practice.status === 1) {
    return {
      isCompleted: true,
      id: practice?.id,
      attemptNumber: practice?.attemptNumber || 1,
    };
  }
  const listIds =
    practice?.groupExamData?.flatMap((item) => item.questionIds) || [];
  const listQuestions =
    (await db?.questions.where('id').anyOf(listIds).toArray()) || [];
  const remainingTime =
    (practice?.totalDuration || 80) * 60 - (practice?.elapsedTime || 0);

  return {
    ...practice,
    listQuestions,
    remainingTime,
    currentSubTopicIndex: practice?.index,
    index: practice?.index?.toString() || '1',
  };
};
