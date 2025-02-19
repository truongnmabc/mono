/**
 * Phát hiện loại thiết bị và trình duyệt từ chuỗi User-Agent.
 *
 * @param {string} userAgent - Chuỗi User-Agent của trình duyệt.
 * @returns {{ device: string; browser: string ,isMobile: boolean }} - Đối tượng chứa thông tin thiết bị và trình duyệt.
 *
 * @example
 * const result = detectAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36");
 * console.log(result);
 * // { device: "Desktop", browser: "Chrome" }
 */

export const detectAgent = (
  userAgent: string
): { device: string; browser: string; isMobile: boolean } => {
  const lowerUserAgent = userAgent.toLowerCase();

  // Detect device
  let device = 'Desktop';
  if (/android.+mobile/i.test(lowerUserAgent)) {
    device = 'Android';
  } else if (/iphone|ipad|ipod/i.test(lowerUserAgent)) {
    device = 'iOS';
  } else if (/android/i.test(lowerUserAgent)) {
    device = 'Android Tablet';
  } else if (/windows phone/i.test(lowerUserAgent)) {
    device = 'Windows Phone';
  }

  // Detect browser
  let browser = 'Unknown';
  if (/chrome|chromium|crios/i.test(lowerUserAgent)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(lowerUserAgent)) {
    browser = 'Firefox';
  } else if (
    /safari/i.test(lowerUserAgent) &&
    !/chrome|chromium|crios/i.test(lowerUserAgent)
  ) {
    browser = 'Safari';
  } else if (/edge|edg/i.test(lowerUserAgent)) {
    browser = 'Edge';
  } else if (/opera|opr/i.test(lowerUserAgent)) {
    browser = 'Opera';
  } else if (/msie|trident/i.test(lowerUserAgent)) {
    browser = 'Internet Explorer';
  }

  const isMobile = device !== 'Desktop';

  return { device, browser, isMobile };
};
