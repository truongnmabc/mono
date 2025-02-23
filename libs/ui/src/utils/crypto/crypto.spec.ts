import { decrypt, encrypt } from './index';

describe('Crypto Utils', () => {
  // Test case cho việc mã hóa và giải mã chuỗi thông thường
  test('should correctly encrypt and decrypt a string', () => {
    const originalText =
      'Dưới đây là cách viết lại hàm decrypt để tương thích với cách mã hóa của crypto';
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(originalText);
  });

  // Test case cho chuỗi rỗng
  test('should handle empty string', () => {
    const originalText = '';
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(originalText);
  });

  // Test case cho chuỗi có ký tự đặc biệt
  test('should handle special characters', () => {
    const originalText = '!@#$%^&*()_+{}[]|":;<>?,./~`';
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(originalText);
  });

  // Test case cho chuỗi Unicode (tiếng Việt)
  test('should handle Unicode characters', () => {
    const originalText = 'Xin chào Việt Nam 🇻🇳';
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(originalText);
  });

  // Test case cho chuỗi dài
  test('should handle long strings', () => {
    const originalText = 'a'.repeat(1000);
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(originalText);
  });

  // Test case kiểm tra tính nhất quán của mã hóa
  test('should produce consistent encryption', () => {
    const originalText = 'Test consistency';
    const encrypted1 = encrypt(originalText);
    const encrypted2 = encrypt(originalText);

    expect(encrypted1).toBe(encrypted2);
  });

  // Test case kiểm tra dữ liệu mã hóa khác với dữ liệu gốc
  test('encrypted data should be different from original', () => {
    const originalText = 'Secret message';
    const encrypted = encrypt(originalText);
    expect(encrypted).not.toBe(originalText);
  });
});
