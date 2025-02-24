import { requestGetData } from '@ui/services/client/request';

/**
 * API Handler cho HTTP GET request.
 *
 * - Nhận một **slug** từ URL parameters (`params.slug`).
 * - Gửi request đến **Google Cloud Storage** để lấy dữ liệu từ file JSON.
 * - Trả về response JSON chứa dữ liệu hoặc thông báo lỗi nếu request thất bại.
 *
 * @param {Request} request - Đối tượng Request của API.
 * @param {{ params: Promise<{ slug: string }> }} context - Context chứa params, trong đó `slug` là tham số URL.
 * @return {Promise<Response>} Trả về một **Promise** chứa Response JSON:
 *  - `{ data, code: 200, status: 1 }` nếu thành công.
 *  - `{ error: "Failed to read appInfos.json" }` nếu thất bại.
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const slug = (await params).slug;

  try {
    const data = await requestGetData({
      url: `/asvab/web-data/topic-${slug}.json?t=${new Date().getTime()}`,
      config: {
        baseURL:
          'https://storage.googleapis.com/micro-enigma-235001.appspot.com',
      },
    });

    return Response.json({
      data: data,
      code: 200,
      status: 1,
    });
  } catch (error) {
    console.log('🚀 ~ error:', error);

    return Response.json({ error: 'Failed to read appInfos.json' });
  }
}
