import { db } from '@ui/db';

type IPropsFinalTest = {
  testId?: number;
};
export const handleGetDataFinalTest = async ({ testId }: IPropsFinalTest) => {
  const finalTest = await db?.testQuestions.get(testId);
  if (finalTest?.status === 1) {
    return {
      isCompleted: true,
      id: finalTest?.id,
      attemptNumber: finalTest?.attemptNumber,
    };
  }
  const listIds =
    finalTest?.groupExamData?.flatMap((item) => item.questionIds) || [];
  const listQuestions =
    (await db?.questions.where('id').anyOf(listIds).toArray()) || [];
  const remainingTime = (finalTest?.totalDuration || 150) * 60;
  return {
    listQuestions,
    ...finalTest,
    index: finalTest?.index?.toString() || '1',
    remainingTime,
  };
};
