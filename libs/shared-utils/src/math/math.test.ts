import { IQuestionBase } from '../type';
import { calculatorAverageLevel, generateRandomNegativeId } from './index';

describe('Math Utils', () => {
  describe('calculatorAverageLevel', () => {
    it('should calculate average level correctly', () => {
      const mockQuestions: IQuestionBase[] = [
        { id: 1, level: 30 },
        { id: 2, level: 40 },
        { id: 3, level: 50 },
      ] as IQuestionBase[];

      const result = calculatorAverageLevel(mockQuestions);
      expect(result).toBe(40);
    });

    it('should handle negative levels by converting to 50', () => {
      const mockQuestions: IQuestionBase[] = [
        { id: 1, level: -1 },
        { id: 2, level: 40 },
        { id: 3, level: -2 },
      ] as IQuestionBase[];

      const result = calculatorAverageLevel(mockQuestions);
      expect(result).toBe((50 + 40 + 50) / 3);
    });

    it('should handle empty question list', () => {
      const result = calculatorAverageLevel([]);
      expect(result).toBe(0); // or NaN, depending on your requirements
    });
  });

  describe('generateRandomNegativeId', () => {
    it('should generate negative number', () => {
      const result = generateRandomNegativeId();
      expect(result).toBeLessThan(0);
    });

    it('should not return excluded number', () => {
      const excluded = -123456;
      const results = Array.from({ length: 100 }, () =>
        generateRandomNegativeId(excluded)
      );
      expect(results.every((id) => id !== excluded)).toBe(true);
    });

    it('should generate unique numbers', () => {
      const results = Array.from({ length: 100 }, () =>
        generateRandomNegativeId()
      );
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(results.length);
    });
  });
});
