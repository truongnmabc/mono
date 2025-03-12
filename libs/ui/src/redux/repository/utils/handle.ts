import { db } from '@ui/db';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';

/**
 * Lấy tiến trình người dùng từ local database (IndexedDB).
 *
 * @param {number} listIds - ID của bài test.
 * @param {"practiceTests" | "learn"} gameMode - Loại tiến trình ("test").
 * @param {number} turn - Số lần thực hiện bài test.
 * @return {Promise<IUserQuestionProgress[] | null>} - Danh sách tiến trình người dùng hoặc null nếu không có.
 */
export const getLocalUserProgress = async (
  listIds: number[],
  gameMode: IGameMode,
  turn: number,
  testId: number
) => {
  // Lấy toàn bộ dữ liệu từ IndexedDB
  const userProgress = await db?.userProgress
    .where('id')
    .anyOf(listIds)
    .toArray();

  if (!userProgress) return [];

  // Lọc selectedAnswers sau khi lấy dữ liệu
  return userProgress
    .filter((progress) =>
      progress.selectedAnswers.some(
        (answer) =>
          answer.turn === turn &&
          answer.type === gameMode &&
          answer.parentId === testId
      )
    )
    .map((progress) => ({
      ...progress,
      selectedAnswers: progress.selectedAnswers.filter(
        (answer) =>
          answer.turn === turn &&
          answer.type === gameMode &&
          answer.parentId === testId
      ),
    }));
};

/**
 * Kết hợp dữ liệu câu hỏi với tiến trình người dùng và sắp xếp lại danh sách.
 *
 * @param {IQuestionOpt[]} questions - Danh sách câu hỏi.
 * @param {IUserQuestionProgress[]} progressData - Dữ liệu tiến trình người dùng.
 * @return {ICurrentGame[]} - Danh sách câu hỏi đã được cập nhật trạng thái từ tiến trình.
 */
export const mapQuestionsWithProgress = (
  questions: IQuestionOpt[],
  progressData: IUserQuestionProgress[]
) => {
  const mappedQuestions = questions.map((question) => {
    const progress = progressData.find((pro) => question.id === pro.id);
    const selectedAnswers = progress?.selectedAnswers || [];

    return {
      ...question,

      selectedAnswer:
        selectedAnswers.length > 0 ? selectedAnswers.at(-1) : null,
      localStatus: progress
        ? selectedAnswers.some((answer) => answer.correct)
          ? 'correct'
          : 'incorrect'
        : 'new',
      hasAnswer: selectedAnswers.length > 0, // Thêm thuộc tính để hỗ trợ sắp xếp
    };
  });

  // Sắp xếp: Câu hỏi đã có câu trả lời lên đầu
  return mappedQuestions.sort(
    (a, b) => Number(b.hasAnswer) - Number(a.hasAnswer)
  );
};
