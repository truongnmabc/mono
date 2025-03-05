import { axiosRequest } from '@ui/services/config/axios';

export async function GET() {
  const slug = process.env.NEXT_PUBLIC_APP_ID;

  try {
    const data = await axiosRequest({
      method: 'post',
      url: 'https://api-cms-v2-dot-micro-enigma-235001.appspot.com/api/app-rating/get-app-good-rating-reviews',
      data: {
        appID: slug,
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
