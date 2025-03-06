import { db } from '@ui/db';
import { IGameMode } from '@ui/models/tests/tests';

type IPropsPracticeTest = {
  testId?: number;
  type: IGameMode;
};
export const handleGetDataPracticeTest = async ({
  testId,
  type,
}: IPropsPracticeTest) => {
  let id = testId;
  if (!testId) {
    const list = await db?.testQuestions
      .where('gameMode')
      .equals(type)
      .toArray();
    const fistTest = list?.find((item) => item.status === 0);
    if (fistTest) {
      id = fistTest.id;
    }
  }
  const practice = await db?.testQuestions.get(id);

  const listIds =
    practice?.groupExamData?.flatMap((item) => item.questionIds) || [];
  const listQuestions =
    (await db?.questions.where('id').anyOf(listIds).toArray()) || [];
  return {
    attemptNumber: practice?.attemptNumber,
    listQuestions,
    id: practice?.id,
    isGamePaused: practice?.isGamePaused,
  };
};
