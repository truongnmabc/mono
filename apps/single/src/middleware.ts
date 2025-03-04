import { IGameMode } from '@ui/models/tests/tests';
import { NextRequest, NextResponse, userAgent } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const testId = searchParams.get('id');
  const partId = searchParams.get('partId');
  const type = searchParams.get('type') as IGameMode;

  const completedTests = request.cookies.get('completed_tests')?.value || '[]';

  const completedTestIds: number[] = JSON.parse(completedTests);

  if (testId && completedTestIds.includes(Number(testId)) && type !== 'learn') {
    const resultUrl = new URL('/result-test', request.url);
    resultUrl.searchParams.set('resultId', testId);
    return NextResponse.redirect(resultUrl);
  }
  if (partId && completedTestIds.includes(Number(partId)) && type === 'learn') {
    const resultUrl = new URL('/finish', request.url);
    resultUrl.searchParams.set('resultId', partId);
    return NextResponse.redirect(resultUrl);
  }
  const { device, os } = userAgent(request);
  let deviceInfo = 'desktop';
  if (device.type === 'mobile') {
    deviceInfo =
      os?.name === 'iOS'
        ? 'mobile-ios'
        : os?.name === 'Android'
        ? 'mobile-android'
        : 'mobile';
  }

  const response = NextResponse.next();
  response.cookies.set('device', deviceInfo);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)',
  ],
};
