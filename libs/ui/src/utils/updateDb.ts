import { db } from '@ui/db';
import { ITestBase } from '@ui/models/tests';

export type IUpdateTestOptions = Partial<
  Pick<
    ITestBase,
    | 'totalDuration'
    | 'isGamePaused'
    | 'startTime'
    | 'remainingTime'
    | 'elapsedTime'
    | 'gameMode'
    | 'gameDifficultyLevel'
    | 'passingThreshold'
    | 'totalQuestion'
    | 'status'
    | 'attemptNumber'
    | 'topicIds'
    | 'groupExamData'
  >
>;

export const updateDbTestQuestions = async ({
  id,
  data,
  isUpAttemptNumber = false,
}: {
  id: number;
  data: IUpdateTestOptions;
  isUpAttemptNumber?: boolean;
}): Promise<void> => {
  try {
    const existingRecord = await db?.testQuestions.get(id);
    if (!existingRecord) {
      console.warn(`⚠️ No record found with ID ${id} in testQuestions`);
      return;
    }

    const updatedData: IUpdateTestOptions = {
      ...data,
      attemptNumber: isUpAttemptNumber
        ? existingRecord.attemptNumber + 1 // Nếu cần tăng attemptNumber thì tăng lên 1
        : data.attemptNumber ?? existingRecord.attemptNumber, // Nếu không thì giữ nguyên hoặc lấy từ data
    };

    await db?.testQuestions.update(id, updatedData);
    console.log('Database updated successfully');
  } catch (error) {
    console.error('Error updating database:', error);
  }
};
