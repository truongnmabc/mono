import Grid2 from '@mui/material/Grid2';
import appInfos from '@single/data/appInfos.json';
import topicsAndTests from '@single/data/home/data.json';
import data from '@single/data/server/dia.json';
import BannerDownloadApp from '@ui/components/bannerDownload';
import MyContainer from '@ui/components/container';
import GridTestsLeft from '@ui/components/gridTests';
import GridTopicLeft from '@ui/components/gridTopics';
import HeaderMobile from '@ui/components/headerMobile';
import AnswerSheet from '@ui/components/listLeftQuestions';
import SeoContent from '@ui/components/seoContent';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import DiagnosticContainer from '@ui/container/diagnostic';
import WrapperAnimationLeft from '@ui/container/study/mainStudyView/wrapperAnimationLeft';
import WrapperAnimation from '@ui/container/study/mainStudyView/wrapperAnimationRight';
import { IGameMode } from '@ui/models/tests/tests';
import { detectAgent } from '@ui/utils/device';
import { replaceYear } from '@ui/utils/time';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Fragment } from 'react';
import dataHome from '@single/data/home/data.json';
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
    canonical: `${process.env.NEXT_PUBLIC_API_URL}diagnostic-test  `,
  },
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { type, testId, turn } = await searchParams;
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
            <HeaderMobile type={type as IGameMode} />
          </Grid2>
        </Grid2>
      )}

      <MyContainer className="sm:py-6 py-4">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="w-full h-full">
          <Grid2
            size={{
              sm: 3,
              xs: 0,
            }}
          >
            <div className="hidden sm:block w-full">
              <WrapperAnimationLeft className="flex p-3 bg-white rounded-xl flex-col gap-4">
                <AnswerSheet
                  wrapperClassName="bg-[#2121210A]"
                  defaultQuestionCount={34}
                />
                <GridTestsLeft
                  appShortName={appInfos.appShortName}
                  type={type as IGameMode}
                  testId={Number(testId)}
                  tests={topicsAndTests.tests.practiceTests.list.sort(
                    (a, b) => {
                      if (String(a.id) === testId) return -1;
                      if (String(b.id) === testId) return 1;
                      return 0;
                    }
                  )}
                />
                <div className="w-full h-[1px] bg-[#21212129]"></div>
                <GridTopicLeft
                  appShortName={appInfos.appShortName}
                  type={type as IGameMode}
                  topics={topicsAndTests.topics.sort((a, b) => {
                    if (String(a.id) === testId) return -1;
                    if (String(b.id) === testId) return 1;
                    return 0;
                  })}
                />
                <div className="w-full h-[1px] bg-[#21212129]"></div>
                <Link
                  href={`${RouterApp.Final_test}?type=${TypeParam.finalTests}&testId=${dataHome.tests.finalTests.id}`}
                >
                  <div className="bg-primary w-full  text-center rounded-md p-2">
                    <p className="text-base capitalize font-semibold text-white">
                      <span className="text-base  font-semibold text-white uppercase">
                        {appInfos.appName}
                      </span>{' '}
                      Final Test
                    </p>
                  </div>
                </Link>
              </WrapperAnimationLeft>
            </div>
          </Grid2>
          <Grid2
            size={{
              sm: 9,
              xs: 12,
            }}
          >
            <WrapperAnimation className="w-full min-h-full flex flex-1 flex-col gap-4 sm:gap-6 h-full pb-24 sm:pb-0">
              <DiagnosticContainer
                isMobile={isMobile}
                testId={Number(testId) || -1}
                turn={Number(turn) || 1}
                appInfo={appInfos}
              />
              <BannerDownloadApp appInfo={appInfos} isMobile={isMobile} />
              {data.content && (
                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                  <SeoContent content={data.content} />
                </div>
              )}
            </WrapperAnimation>
          </Grid2>
        </Grid2>
      </MyContainer>
    </Fragment>
  );
};
export default Page;
