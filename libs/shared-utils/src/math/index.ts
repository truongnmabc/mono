import { IQuestionBase } from '@shared-models/question';
import { ITopicBase } from '@shared-models/topics';
import { v4 as uuidv4 } from 'uuid';

export const groupTopics = (
  listTopic: ITopicBase[],
  sequence: number
): Array<{ id: number; value: ITopicBase[] }> => {
  const arr: Array<{ id: number; value: ITopicBase[] }> = [];
  let idx = 0;

  for (let i = 0; i < listTopic.length; i++) {
    if (!arr[idx]) arr[idx] = { id: idx + 1, value: [] };
    arr[idx].value.push(listTopic[i]);
    if (arr[idx].value.length === sequence) idx++;
  }

  return arr;
};

export const calculatorAverageLevel = (questions: IQuestionBase[]): number => {
  const listLevel = questions.map((ques) => (ques.level < 0 ? 50 : ques.level));

  const totalLevel = listLevel.reduce((acc, curr) => acc + curr, 0);

  return totalLevel / listLevel.length;
};

/**
 * Generates a random unique negative ID using UUID v4.
 *
 * @param {number} exclude - The ID to exclude from the result.
 * @return {number} A unique negative ID that is not equal to the excluded value.
 */

export function generateRandomNegativeId(exclude: number = -1): number {
  let randomId: number;
  do {
    // Generate a UUID, hash it, and convert it to a negative number
    randomId = -parseInt(uuidv4().replace(/-/g, '').slice(0, 6), 16);
  } while (randomId === exclude);
  return randomId;
}
