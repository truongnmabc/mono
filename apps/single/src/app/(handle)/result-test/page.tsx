import topicData from '@single/data/home/data.json';
import data from '@single/data/server/result.json';
import ResultTestLayout from '@ui/container/result';
import { IGameMode } from '@ui/models/tests/tests';
import { detectAgent } from '@ui/utils/device';
import { replaceYear } from '@ui/utils/time';
import { Metadata } from 'next';
import { headers } from 'next/headers';
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
      topics={topicData?.topics.sort((a, b) => a.orderIndex - b.orderIndex)}
      branchTest={topicData?.tests.branchTest.list}
    />
  );
}
