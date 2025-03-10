import { TypeParam } from '@ui/constants';
import { db } from '@ui/db';

type IPropsDiagnosticTest = {
  testId?: number;
};
export const handleGetDataDiagnosticTest = async ({
  testId,
}: IPropsDiagnosticTest) => {
  const diagnostic =
    testId !== -1
      ? await db?.testQuestions.get(testId)
      : await db?.testQuestions
          .where('gameMode')
          .equals(TypeParam.diagnosticTest)
          .first();
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
