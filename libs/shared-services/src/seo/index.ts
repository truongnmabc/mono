import { axiosRequest } from '../config/axios';
import { AxiosResponse } from 'axios';

interface TitleSeoResponse {
  content: string | undefined;
  titleSeo: string | undefined;
  descSeo: string | undefined;
}

/**
 * Gọi API để lấy thông tin SEO của một tiểu bang dựa trên slug.
 * @param {string} slug - Slug của tiểu bang cần lấy thông tin.
 * @return {Promise<TitleSeoResponse>} - Đối tượng chứa thông tin SEO.
 */
export const requestGetTitleSeoPage = async (
  slug: string
): Promise<TitleSeoResponse> => {
  try {
    const response: AxiosResponse<TitleSeoResponse> =
      await axiosRequest<TitleSeoResponse>({
        method: 'get',
        url: '/wp-json/passemall/v1/get-info-state',
        params: {
          stateSlug: slug,
        },
        baseUrl: 'https://api.asvab-prep.com',
      });

    return (
      response.data ?? {
        content: undefined,
        titleSeo: undefined,
        descSeo: undefined,
      }
    );
  } catch (error) {
    console.error('Error in titleSeoService:', error);
    return { content: undefined, titleSeo: undefined, descSeo: undefined };
  }
};
