/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns boolean - True if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns boolean - True if phone number is valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};
