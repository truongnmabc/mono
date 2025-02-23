import { v4 as uuidv4 } from 'uuid';
import { IQuestionBase, ITopicBase } from '../type';

/**
 * Groups an array of topics into smaller arrays of specified size
 * @param listTopic - Array of topics to be grouped
 * @param sequence - Size of each group
 * @returns Array of objects containing grouped topics with sequential IDs
 * @example
 * const topics = [topic1, topic2, topic3, topic4];
 * const grouped = groupTopics(topics, 2);
 * // Returns: [
 * //   { id: 1, value: [topic1, topic2] },
 * //   { id: 2, value: [topic3, topic4] }
 * // ]
 */

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

/**
 * Calculates the average level of questions
 * Converts negative levels to 50 before calculation
 * @param questions - Array of questions containing level property
 * @returns Average level of all questions
 * @example
 * const questions = [
 *   { level: 30 },
 *   { level: -1 }, // Will be converted to 50
 *   { level: 40 }
 * ];
 * const avg = calculatorAverageLevel(questions); // Returns 40
 */
export const calculatorAverageLevel = (questions: IQuestionBase[]): number => {
  if (questions.length === 0) return 0;

  const listLevel = questions.map((ques) => (ques.level < 0 ? 50 : ques.level));
  const totalLevel = listLevel.reduce((acc, curr) => acc + curr, 0);
  return totalLevel / listLevel.length;
};

/**
 * Generates a random unique negative ID using UUID v4
 * @param exclude - Optional number to exclude from generation
 * @returns A negative number that can be used as a unique ID
 * @example
 * const id1 = generateRandomNegativeId(); // Returns something like -123456
 * const id2 = generateRandomNegativeId(-123456); // Returns different negative number
 */
export function generateRandomNegativeId(exclude: number = -1): number {
  let randomId: number;
  do {
    // Generate a UUID, hash it, and convert it to a negative number
    randomId = -parseInt(uuidv4().replace(/-/g, '').slice(0, 6), 16);
  } while (randomId === exclude);
  return randomId;
}
