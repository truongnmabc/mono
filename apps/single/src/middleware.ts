import { NextRequest, NextResponse, userAgent } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const testId = searchParams.get('id');
  const testType = searchParams.get('type');

  const completedTests = request.cookies.get('completed_tests')?.value || '[]';
  console.log('🚀 ~ middleware ~ completedTests:', completedTests);

  const completedTestIds: number[] = JSON.parse(completedTests);

  if (testId && completedTestIds.includes(Number(testId))) {
    const resultUrl = new URL('/result-test', request.url);
    // resultUrl.searchParams.set('id', testId);
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
