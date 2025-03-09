import { db } from '@ui/db';
import { IGameMode } from '@ui/models/tests/tests';

type IPropsReview = {
  testId?: number;
  type: IGameMode;
};
export const handleGetDataReview = async ({ testId, type }: IPropsReview) => {
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
