import { db } from '@ui/db';

type IPropsFinalTest = {
  testId?: number;
};
export const handleGetDataFinalTest = async ({ testId }: IPropsFinalTest) => {
  const finalTest = await db?.testQuestions.get(testId);
  const listIds =
    finalTest?.groupExamData?.flatMap((item) => item.questionIds) || [];
  const listQuestions =
    (await db?.questions.where('id').anyOf(listIds).toArray()) || [];
  return {
    listQuestions,
    ...finalTest,
  };
};
