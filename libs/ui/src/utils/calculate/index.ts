import { IUserQuestionProgress } from '@ui/models';

export const totalPassingPart = ({
  progress,
  averageLevel,
  turn,
}: {
  progress: IUserQuestionProgress[];
  averageLevel: number;
  turn: number;
}) => {
  const passing = progress.reduce((acc, cur) => {
    if (!cur?.selectedAnswers?.length) return acc;

    // Lấy 3 câu trả lời cuối cùng
    const lastThreeElements = cur.selectedAnswers.slice(-3);

    const score = lastThreeElements.reduce((sum, item) => {
      if (item.turn === turn) {
        return sum + (item.correct ? 1 : 0.25) / 3;
      }
      return sum;
    }, 0);

    const levelRatio = cur.level / (averageLevel || 1);

    return acc + score * levelRatio;
  }, 0);

  return passing;
};
