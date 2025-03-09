import ResultTestLayout from '@ui/container/result';
import { headers } from 'next/headers';
import data from '@single/data/server/result.json';
import { detectAgent } from '@ui/utils/device';
import { Metadata } from 'next';
import { replaceYear } from '@ui/utils/time';
import { IGameMode } from '@ui/models/tests/tests';
import topicData from '@single/data/home/data.json';
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
    canonical: `${process.env.NEXT_PUBLIC_API_URL}result-test`,
  },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { gameMode, resultId } = await searchParams;
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
  return (
    <ResultTestLayout
      isMobile={isMobile}
      gameMode={gameMode as IGameMode}
      resultId={Number(resultId)}
      topics={topicData?.topics}
      branchTest={topicData?.tests.branchTest.list}
    />
  );
}
