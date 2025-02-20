import { Poppins, Vampiro_One } from 'next/font/google';

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import '@shared-uis/styles/index.css';
import { replaceYear } from '@shared-utils/time';
import type { Metadata } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
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

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: replaceYear(appInfo.title),
  description: appInfo.descriptionSEO,
  keywords: appInfo.keywordSEO,
  icons: `/infos/${appInfo?.appShortName}/logo60.png`,
  openGraph: {
    description: appInfo.descriptionSEO,
    title: appInfo.title,
    images: `/infos/${appInfo?.appShortName}/logo60.png`,
  },
};

export default function ParentAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${vampiro?.variable} ${poppins?.variable} font-sans`}
    >
      <Head>
        <Link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <RootLayout>{children}</RootLayout>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
      </body>
      <Script src="https://accounts.google.com/gsi/client" async defer />
      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        async
        defer
      />
    </html>
  );
}
