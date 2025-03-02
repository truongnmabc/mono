import { NextResponse } from 'next/server';
import data from '@single/data/sw/topics.json' assert { type: 'json' };
export const dynamic = 'force-static';
export async function GET() {
  try {
    return NextResponse.json(data);
  } catch (error) {
    console.log('🚀 ~ GET ~ error:', error);
    return new NextResponse(JSON.stringify({ error: 'Không thể đọc file ' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
