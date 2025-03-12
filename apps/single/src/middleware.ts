import { NextRequest, NextResponse, userAgent } from 'next/server';

export function middleware(request: NextRequest) {
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
  const isPro = request.cookies.get('isPro')?.value || 'false';
  const response = NextResponse.next();
  response.cookies.set('device', deviceInfo);
  response.cookies.set('isPro', isPro);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)',
  ],
};
