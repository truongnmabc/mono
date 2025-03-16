import axios, { AxiosResponse } from 'axios';
import {
  BASE_GET_PRO,
  BASE_URL,
  BASE_URL_DEV,
  BASE_URL_PROP,
  DASHBOARD_API,
  TRACKING_API,
} from '../constant';

const defaultBaseURL =
  process.env['NODE_ENV'] === 'development'
    ? process.env['DEV_BASE_API'] || ''
    : process.env['NEXT_PUBLIC_API_URL'] || '';

export type AxiosRequestProps<
  TData = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
> = {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  url: string;
  data?: TData;
  params?: TParams;
  // Sử dụng các base đã định nghĩa
  base?:
    | 'default'
    | 'test'
    | 'prop'
    | 'dev'
    | 'dashboard'
    | 'tracking'
    | 'getPro';
  // Nếu truyền vào baseUrl thì sẽ ghi đè các base đã định nghĩa
  baseUrl?: string;
};

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: defaultBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window === 'undefined') {
      config.headers = config.headers || {};
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('Axios Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Hàm wrapper để thực hiện yêu cầu với khả năng chuyển đổi linh hoạt giữa các base URL.
 *
 * Nếu truyền vào thuộc tính baseUrl thì sẽ sử dụng giá trị đó, ngược lại dựa theo thuộc tính base.
 *
 * @param props - Các thuộc tính truyền vào, bao gồm method, url, data, params, base hoặc baseUrl.
 * @returns Promise trả về kết quả của axios.
 */
export function axiosRequest<
  TData = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
>({
  method = 'get',
  url,
  data,
  params = {} as TParams,
  base = 'default',
  baseUrl,
}: AxiosRequestProps<TData, TParams>): Promise<AxiosResponse> {
  let selectedBaseURL: string;

  if (baseUrl) {
    selectedBaseURL = baseUrl;
  } else {
    switch (base) {
      case 'test':
        selectedBaseURL = BASE_URL;
        break;
      case 'prop':
        selectedBaseURL = BASE_URL_PROP;
        break;
      case 'dev':
        selectedBaseURL = BASE_URL_DEV;
        break;
      case 'dashboard':
        selectedBaseURL = DASHBOARD_API;
        break;

      case 'tracking':
        selectedBaseURL = TRACKING_API;
        break;
      case 'getPro':
        selectedBaseURL = BASE_GET_PRO;
        break;
      case 'default':
        selectedBaseURL = defaultBaseURL;
        break;

      default:
        selectedBaseURL = defaultBaseURL;
        break;
    }
  }

  return axiosInstance({
    method,
    url,
    data,
    params,
    baseURL: selectedBaseURL,
  });
}
