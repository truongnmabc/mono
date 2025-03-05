import { db } from '@ui/db';

type IPropsDiagnosticTest = {
  testId?: number;
};
export const handleGetDataDiagnosticTest = async ({
  testId,
}: IPropsDiagnosticTest) => {
  const diagnostic = await db?.testQuestions.get(testId);
  const listIds =
    diagnostic?.groupExamData?.flatMap((item) => item.questionIds) || [];
  const listQuestions =
    (await db?.questions.where('id').anyOf(listIds).toArray()) || [];
  return {
    attemptNumber: diagnostic?.attemptNumber,
    listQuestions,
    id: diagnostic?.id,
    isGamePaused: diagnostic?.isGamePaused,
  };
};
