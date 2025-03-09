import { TypeParam } from '@ui/constants';
import { db } from '@ui/db';
import { IGameMode } from '@ui/models/tests/tests';
import { c } from 'framer-motion/dist/types.d-6pKw1mTI';

type IPropsCustom = {
  testId?: number;
  type: IGameMode;
};

const getAllDataCustom = async () => {
  const list = await db?.testQuestions
    .where('gameMode')
    .equals(TypeParam.customTests)
    .toArray();

  if (!list || list.length === 0) return null;
  const fistTest = list?.findIndex((item) => item.status === 0);
  if (fistTest !== -1)
    return {
      ...list[fistTest],
      index: fistTest,
    };
  return {
    ...list?.[list.length - 1],
    index: list.length - 1,
  };
};

export const handleGetDataCustom = async ({ testId, type }: IPropsCustom) => {
  const custom = testId
    ? await db?.testQuestions.get(testId)
    : await getAllDataCustom();

  if (!custom) {
    return {
      shouldOpenSettingCustomTest: true,
    };
  }

  if (custom?.status === 1) {
    return {
      isCompleted: true,
      id: custom?.id,
      attemptNumber: custom?.attemptNumber || 1,
    };
  }
  const listIds =
    custom?.groupExamData?.flatMap((item) => item.questionIds) || [];
  const listQuestions =
    (await db?.questions.where('id').anyOf(listIds).toArray()) || [];

  const remainingTime =
    (custom?.totalDuration || 80) * 60 - (custom?.elapsedTime || 0);

  return {
    ...custom,
    attemptNumber: custom?.attemptNumber,
    listQuestions,
    id: custom?.id,
    isGamePaused: custom?.isGamePaused,
    currentSubTopicIndex: custom?.index,
    index: custom?.index?.toString() || '1',
    remainingTime,
  };
};
