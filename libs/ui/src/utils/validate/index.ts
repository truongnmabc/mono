/**
 * Interface cho hàm validate
 */
export interface ValidationFunction {
  (value: string): boolean;
}

/**
 * Kiểm tra email hợp lệ
 * @param {string} email - Địa chỉ email cần kiểm tra
 * @returns {boolean} - True nếu hợp lệ, False nếu không hợp lệ
 */
const validateEmail: ValidationFunction = (email: string): boolean => {
  // 🔥 Thêm kiểu `string`
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

/**
 * Kiểm tra số điện thoại hợp lệ
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} - True nếu hợp lệ, False nếu không hợp lệ
 */
const validatePhone: ValidationFunction = (phone: string): boolean => {
  // 🔥 Thêm kiểu `string`
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export { validateEmail, validatePhone };
