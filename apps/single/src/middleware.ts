import { NextRequest, NextResponse, userAgent } from 'next/server';
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathSegments = pathname?.split('/').filter(Boolean);
  const slug = pathSegments[0];
  const { device, os } = userAgent(request);
  let deviceInfo = 'desktop';
  if (device.type === 'mobile') {
    if (os?.name === 'iOS') {
      deviceInfo = 'mobile-ios';
    } else if (os?.name === 'Android') {
      deviceInfo = 'mobile-android';
    } else {
      deviceInfo = 'mobile';
    }
  }
  if (pathname === '/blog') {
    const redirectUrl = `https://${process.env.NEXT_PUBLIC_APP_SHORT_NAME}.com/blog`;
    return NextResponse.redirect(redirectUrl);
  }

  const redirectPaths: string[] = [
    'score-calculator',
    'refund-policy',
    'terms-of-service',
    'privacy',
    'editorial-policy',
    'study-guide',
    'blog',
  ];

  if (redirectPaths.includes(slug)) {
    const redirectUrl = `https://${
      process.env.NEXT_PUBLIC_APP_SHORT_NAME
    }-prep.com/${process.env.NEXT_PUBLIC_APP_SHORT_NAME + '-' + slug}`;
    console.log('🚀 ~ middleware ~ redirectUrl:', redirectUrl);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  response.cookies.set('device', deviceInfo);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - /image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)',
  ],
};
