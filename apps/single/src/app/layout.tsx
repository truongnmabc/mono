import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import seoData from '@single/data/home/data.json';
import { IDevice, ITheme } from '@ui/models/app';
import '@ui/styles/index.css';
import { getImageSrc } from '@ui/utils/image';
import { replaceYear } from '@ui/utils/time';
import type { Metadata } from 'next';
import { Poppins, Vampiro_One } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';
import '../css/global.css';
import appInfo from '../data/appInfos.json';
import RootLayout from '../layout';
const vampiro = Vampiro_One({
  weight: ['400'],
  style: 'normal',
  preload: true,
  display: 'swap',
  variable: '--font-vampiro',
  subsets: ['latin'],
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  style: 'normal',
  preload: true,
  display: 'swap',
  variable: '--font-poppins',
  subsets: ['latin'],
});
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/';
const logoUrl = getImageSrc('logo.png');
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: replaceYear(seoData.seo.titleSeo),
  description: replaceYear(seoData.seo.descSeo),
  keywords: appInfo.keywordSEO,
  icons: logoUrl,
  openGraph: {
    description: replaceYear(seoData.seo.descSeo),
    title: replaceYear(seoData.seo.titleSeo),
    images: logoUrl,
  },
  twitter: {
    title: replaceYear(seoData.seo.titleSeo),
    description: replaceYear(seoData.seo.descSeo),
    images: logoUrl,
  },
  alternates: {
    canonical: baseUrl,
  },
};
export default async function ParentAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');
  const device = cookieStore.get('device');

  return (
    <html
      lang="en"
      className={`${vampiro?.variable} ${poppins?.variable} font-sans`}
    >
      <body>
        <RootLayout
          device={device?.value as IDevice}
          theme={theme?.value as ITheme}
          data={{
            topics: seoData.topics,
            branch: seoData.tests.branchTest,
            finalTest: seoData.tests.finalTests.testId,
          }}
        >
          {children}
        </RootLayout>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        <Script src="/init-db.js" strategy="beforeInteractive" />
        <Script src="/sw-register.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
