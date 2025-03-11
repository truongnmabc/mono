import appInfo from '@single/data/appInfos.json';
import { detectAgent } from '@ui/utils';
import { headers } from 'next/headers';
import BillingPage from './_components';
import type { Metadata } from 'next';
import { replaceYear } from '@ui/utils/time';
import data from '@single/data/server/billing.json';

export const metadata: Metadata = {
  title: replaceYear(data?.titleSeo),
  description: replaceYear(data?.descSeo),
  openGraph: {
    title: replaceYear(data?.titleSeo),
    description: replaceYear(data?.descSeo),
  },
  twitter: {
    title: replaceYear(data?.titleSeo),
    description: replaceYear(data?.descSeo),
  },
  alternates: {
    canonical: `${process.env['NEXT_PUBLIC_API_URL']}billing`,
  },
};

const BillingApp = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');

  return <BillingPage isMobile={isMobile} appInfo={appInfo} />;
};

export default BillingApp;
