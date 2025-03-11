import FinishLayout from '@ui/container/finish';

import type { Metadata } from 'next';
import { replaceYear } from '@ui/utils/time';
import data from '@single/data/server/finish.json';
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
    canonical: `${process.env['NEXT_PUBLIC_API_URL']}finish`,
  },
};
const FinishPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { topic, resultId, attemptNumber, index } = await searchParams;

  return (
    <FinishLayout
      topic={topic}
      resultId={Number(resultId)}
      attemptNumber={Number(attemptNumber)}
      index={index}
    />
  );
};

export default FinishPage;
