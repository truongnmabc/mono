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
import RouterApp from '@ui/constants/router.constant';
import DiagnosticContainer from '@ui/container/diagnostic';
import { IGameMode } from '@ui/models/tests/tests';
import { detectAgent } from '@ui/utils/device';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: data.titleSeo || appInfos.title,
  description: data.descSeo || appInfos.descriptionSEO,
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { type, id, turn } = await searchParams;
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

      <MyContainer className="sm:py-6 py-4">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="w-full h-full">
          <Grid2
            size={{
              sm: 3,
              xs: 0,
            }}
          >
            <div className="hidden sm:block w-full">
              <div className="flex p-3 bg-white rounded-xl flex-col gap-4">
                <AnswerSheet
                  wrapperClassName="bg-[#2121210A]"
                  defaultQuestionCount={34}
                />
                <GridTestsLeft
                  appShortName={appInfos.appShortName}
                  type={type as IGameMode}
                  id={id}
                  tests={topicsAndTests.tests.practiceTests.list.sort(
                    (a, b) => {
                      if (String(a.id) === id) return -1;
                      if (String(b.id) === id) return 1;
                      return 0;
                    }
                  )}
                />
                <div className="w-full h-[1px] bg-[#21212129]"></div>
                <GridTopicLeft
                  appShortName={appInfos.appShortName}
                  type={type as IGameMode}
                  id={id}
                  topics={topicsAndTests.topics.sort((a, b) => {
                    if (String(a.id) === id) return -1;
                    if (String(b.id) === id) return 1;
                    return 0;
                  })}
                />
                <div className="w-full h-[1px] bg-[#21212129]"></div>
                <Link href={`${RouterApp.Final_test}`}>
                  <div className="bg-primary w-full  text-center rounded-md p-2">
                    <p className="text-base capitalize font-semibold text-white">
                      <span className="text-base  font-semibold text-white uppercase">
                        {appInfos.appShortName}
                      </span>{' '}
                      Final Test
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </Grid2>
          <Grid2
            size={{
              sm: 9,
              xs: 12,
            }}
          >
            <div className="w-full min-h-full flex flex-1 flex-col gap-4 sm:gap-6 h-full pb-24 sm:pb-0">
              <DiagnosticContainer
                isMobile={isMobile}
                id={Number(id) || -1}
                turn={Number(turn) || 1}
              />
              <BannerDownloadApp appInfo={appInfos} isMobile={isMobile} />
              {data.content && (
                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                  <SeoContent content={data.content} />
                </div>
              )}
            </div>
          </Grid2>
        </Grid2>
      </MyContainer>
    </Fragment>
  );
};
export default Page;
