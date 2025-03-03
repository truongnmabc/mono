import Grid2 from '@mui/material/Grid2';
import appInfo from '@single/data/appInfos.json';
import data from '@single/data/home/data.json';
import list from '@single/data/seo.json';
import BannerDownloadApp from '@ui/components/bannerDownload';
import MyContainer from '@ui/components/container';
import HeaderMobile from '@ui/components/headerMobile';
import SeoContent from '@ui/components/seoContent';
import MainStudyView from '@ui/container/study/mainStudyView';
import QuestionGroup from '@ui/container/study/questionGroup';
import { IGameMode } from '@ui/models/tests/tests';
import { detectAgent } from '@ui/utils/device';
import { headers } from 'next/headers';
import { Fragment } from 'react';
// export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams() {
  const tests = Object.keys(list.rewrite.test);
  const branch = Object.keys(list.rewrite.branch);
  return [...tests, ...branch].map((post) => ({
    slug: post,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const listRewrite = {
    ...list.rewrite.test,
    ...list.rewrite.branch,
    practiceTest: list.default.practiceTest,
  };
  const data = listRewrite[slug as keyof typeof listRewrite];
  return {
    title: data.titleSeo,
    description: data.descSeo,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const slug = (await params).slug;
  const { type, id, subId, partId } = await searchParams;
  const listRewrite = {
    ...list.rewrite.test,
    ...list.rewrite.branch,
  };
  const { content } =
    listRewrite[slug as keyof typeof listRewrite] || list.default;

  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
  return (
    <Fragment>
      {isMobile && (
        <Grid2 container>
          <Grid2
            size={{
              sm: 0,
              md: 0,
              xs: 12,
            }}
          >
            <HeaderMobile />
          </Grid2>
        </Grid2>
      )}

      <MyContainer className="py-4">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="w-full h-full">
          {!isMobile && (
            <Grid2
              size={{
                sm: 3,
              }}
            >
              <QuestionGroup
                data={{
                  topics: data.topics,
                  tests: data.tests.practiceTests,
                  branch: data.tests.branchTest,
                }}
                type={type as IGameMode}
                appShortName={appInfo.appShortName}
                id={id}
              />
            </Grid2>
          )}

          <Grid2
            size={{
              sm: 9,
              xs: 12,
            }}
          >
            <div className="w-full pb-24 sm:pb-0  min-h-full flex flex-1 flex-col gap-4 sm:gap-6   h-full">
              <MainStudyView
                type={type as IGameMode}
                id={id ? Number(id) : -1}
                data={{
                  topics: data.topics,
                  tests: data.tests.practiceTests,
                }}
                appInfo={appInfo}
                subId={Number(subId)}
                partId={Number(partId)}
                isMobile={isMobile}
                slug={slug}
              />
              <BannerDownloadApp appInfo={appInfo} isMobile={isMobile} />
              {content && (
                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                  <SeoContent content={content} />
                </div>
              )}
            </div>
          </Grid2>
        </Grid2>
      </MyContainer>
    </Fragment>
  );
}
