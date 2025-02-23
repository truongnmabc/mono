import { convertToJSONObject, parseJSONdata } from './index';

describe('JSON Utils', () => {
  describe('convertToJSONObject', () => {
    it('should convert a simple object correctly', () => {
      const input = { name: 'test', value: 123 };
      const result = convertToJSONObject(input);
      expect(result).toEqual(input);
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: 'John',
          age: 30,
          address: {
            city: 'New York',
          },
        },
      };
      const result = convertToJSONObject(input);
      expect(result).toEqual(input);
    });

    it('should handle arrays', () => {
      const input = [1, 2, { name: 'test' }];
      const result = convertToJSONObject(input);
      expect(result).toEqual(input);
    });

    it('should handle null and undefined', () => {
      const input = { a: null, b: undefined };
      const result = convertToJSONObject(input);
      expect(result).toEqual({ a: null }); // undefined được chuyển thành null trong JSON
    });
  });

  describe('parseJSONdata', () => {
    it('should parse valid JSON string', () => {
      const jsonString = '{"name":"test","value":123}';
      const result = parseJSONdata<{ name: string; value: number }>(jsonString);
      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should return null for non-string input', () => {
      const input = { name: 'test' };
      const result = parseJSONdata(input);
      expect(result).toBeNull();
    });

    it('should handle array JSON string', () => {
      const jsonString = '[1,2,3]';
      const result = parseJSONdata<number[]>(jsonString);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle nested JSON string', () => {
      const jsonString = '{"user":{"name":"John","age":30}}';
      const result = parseJSONdata<{ user: { name: string; age: number } }>(
        jsonString
      );
      expect(result).toEqual({
        user: {
          name: 'John',
          age: 30,
        },
      });
    });
  });
});
