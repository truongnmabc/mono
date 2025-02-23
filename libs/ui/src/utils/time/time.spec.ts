import { replaceYear } from './replaceYear';

describe('replaceYear', () => {
  // Mock current year để đảm bảo tests ổn định
  const mockDate = new Date('2024-01-01');
  const originalDate = global.Date;

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as DateConstructor;
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  it('should replace past years with current year', () => {
    expect(replaceYear('Copyright 2020')).toBe('Copyright 2024');
    expect(replaceYear('Founded in 1999')).toBe('Founded in 2024');
  });

  it('should not replace future years', () => {
    expect(replaceYear('Vision 2025')).toBe('Vision 2025');
    expect(replaceYear('Goals for 2030')).toBe('Goals for 2030');
  });

  it('should handle multiple years in a string', () => {
    expect(replaceYear('From 2020 to 2025')).toBe('From 2024 to 2025');
    expect(replaceYear('1999, 2020, and 2030')).toBe('2024, 2024, and 2030');
  });

  it('should return original string if no years found', () => {
    expect(replaceYear('No years here')).toBe('No years here');
    expect(replaceYear('123 456')).toBe('123 456');
  });

  it('should handle empty or invalid input', () => {
    expect(replaceYear('')).toBe('');
    expect(replaceYear(null as unknown as string)).toBe(
      null as unknown as string
    );
    expect(replaceYear(undefined as unknown as string)).toBe(
      undefined as unknown as string
    );
  });

  it('should only replace 4-digit years starting with 19 or 20', () => {
    expect(replaceYear('1899 1900 2000 2100')).toBe('1899 2024 2024 2100');
    expect(replaceYear('1234 5678')).toBe('1234 5678');
  });
});
