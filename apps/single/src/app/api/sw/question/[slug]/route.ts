import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  const filePath = path.join(
    process.cwd(),
    'src/data/sw',
    `questions_${slug}.json`
  );

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');

    return new NextResponse(fileContents, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('🚀 ~ GET ~ error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Không thể đọc file questions_0.json' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
