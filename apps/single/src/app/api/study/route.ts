import study from '@single/data/topics.json' assert { type: 'json' };

export async function GET() {
  return Response.json({
    data: study,
    code: 200,
    status: 1,
  });
}
