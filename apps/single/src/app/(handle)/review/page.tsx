import MyContainer from '@ui/components/container';
import { detectAgent } from '@ui/utils/device';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import { replaceYear } from '@ui/utils/time';
import data from '@single/data/server/review.json';
import ReviewLayout from '@ui/container/review';
import appInfo from '@single/data/appInfos.json';
import topics from '@single/data/home/data.json';

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
type IMode = 'weak' | 'hard' | 'saved' | 'all' | 'random';

const ReviewPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { mode, isReady } = await searchParams;
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
  return (
    <MyContainer className="h-full sm:py-0">
      <ReviewLayout
        isMobile={isMobile}
        mode={mode as IMode}
        appInfo={appInfo}
        content={data?.content}
        isReady={isReady === 'true'}
        topics={topics.topics}
      />
    </MyContainer>
  );
};

export default ReviewPage;
