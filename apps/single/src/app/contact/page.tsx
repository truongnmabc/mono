import appConfig from '@single/data/appConfig.json';
import appInfos from '@single/data/appInfos.json';

import data from '@single/data/server/review.json';
import { detectAgent } from '@ui/utils';
import { replaceYear } from '@ui/utils/time';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import FaqAsvab from './_components/asvab/faqAsvab';
import TopContactAsvab from './_components/asvab/topContactAsvab';
import './_components/index.scss';
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
    canonical: `${process.env['NEXT_PUBLIC_API_URL']}review`,
  },
};
const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
  const { openBox } = await searchParams;
  return (
    <div className="contact-page">
      <div className="cluster-infor-title">
        <TopContactAsvab appInfo={appInfos} appConfig={appConfig} />
      </div>
      <div className="cluster-faqs">
        <div className="contact-body-component max-w-component-desktop">
          <div className="contact-body-container">
            <div className="title">FAQs</div>
            <FaqAsvab isMobile={isMobile} openBox={openBox} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
