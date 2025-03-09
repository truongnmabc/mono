import { db } from '@ui/db';

type IPropsDiagnosticTest = {
  testId?: number;
};
export const handleGetDataDiagnosticTest = async ({
  testId,
}: IPropsDiagnosticTest) => {
  const diagnostic = await db?.testQuestions.get(testId);
  if (diagnostic?.status === 1) {
    return {
      isCompleted: true,
      resultId: diagnostic?.id,
      attemptNumber: diagnostic?.attemptNumber,
      id: diagnostic?.id,
    };
  }
  const listIds =
    diagnostic?.groupExamData?.flatMap((item) => item.questionIds) || [];
  const listQuestions =
    (await db?.questions.where('id').anyOf(listIds).toArray()) || [];
  return {
    ...diagnostic,
    listQuestions,
    remainingTime: 80,
    totalDuration: 1,
    index: diagnostic?.index?.toString() || '1',
    isCompleted: false,
  };
};
