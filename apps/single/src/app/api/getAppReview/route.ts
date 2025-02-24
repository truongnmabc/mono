import { requestGetData } from '@ui/services/client/request';

export async function GET() {
  const slug = process.env.NEXT_PUBLIC_APP_ID;

  try {
    const data = await requestGetData({
      url:
        'https://dashboard-api2.abc-elearning.org/ratings-reviews?appID=' +
        slug,
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
