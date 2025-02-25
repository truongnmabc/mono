import { db } from '@ui/db';

export const calculatePassingApp = async () => {
  const [users, app] = await Promise.all([
    db?.userProgress.toArray(),
    db?.passingApp.get(-1),
  ]);

  if (!app || !users?.length) return 0;

  const { totalQuestion, averageLevel } = app;

  const totalPassing = users.reduce((acc, cur) => {
    if (!cur?.selectedAnswers?.length) return acc;

    const lastThreeAnswers = cur.selectedAnswers.slice(-3);

    const score = lastThreeAnswers.reduce((sum, item) => {
      return sum + (item.correct ? 1 : 0.25) / 3;
    }, 0);

    const levelRatio = cur.level / (averageLevel || 1);

    return acc + score * levelRatio;
  }, 0);

  const passingApp = (totalPassing / (totalQuestion || 1)) * 100;

  return passingApp > 96 ? 96 : passingApp;
};
