import MyContainer from '@ui/components/container';
import { Fragment } from 'react';
import { Grid2 } from '@mui/material';
import HeaderMobile from '@ui/components/headerMobile';
import { detectAgent } from '@ui/utils/device';
import { replaceYear } from '@ui/utils/time';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import dataSeo from '@single/data/server/custom.json';
import LeftLayout from '@ui/container/custom_test/leftLayout';
import ContentCustomTest from '@ui/container/custom_test/contentCustomTest';
import WrapperAnimationLeft from '@ui/container/study/mainStudyView/wrapperAnimationLeft';
import BannerDownloadApp from '@ui/components/bannerDownload';
import SeoContent from '@ui/components/seoContent';
import appInfos from '@single/data/appInfos.json';
import WrapperAnimation from '@ui/container/study/mainStudyView/wrapperAnimationRight';
import dataHome from '@single/data/home/data.json';
import { IGameMode } from '@ui/models/tests/tests';
export const metadata: Metadata = {
  title: replaceYear(dataSeo?.titleSeo),
  description: replaceYear(dataSeo?.descSeo),
  openGraph: {
    title: replaceYear(dataSeo?.titleSeo),
    description: replaceYear(dataSeo?.descSeo),
  },
  twitter: {
    title: replaceYear(dataSeo?.titleSeo),
    description: replaceYear(dataSeo?.descSeo),
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_API_URL}diagnostic-test  `,
  },
};

export default async function CustomPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { testId, turn, type, isCreate } = await searchParams;
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
      <MyContainer className="py-4">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="w-full h-full">
          <Grid2
            size={{
              sm: 3,
              xs: 12,
            }}
          >
            <WrapperAnimationLeft className="flex p-3 bg-white rounded-xl flex-col gap-4">
              <LeftLayout
                isMobile={isMobile}
                topics={dataHome.topics}
                testId={Number(testId ?? -1)}
              />
            </WrapperAnimationLeft>
          </Grid2>
          <Grid2
            size={{
              sm: 9,
              xs: 12,
            }}
          >
            <WrapperAnimation className="w-full  min-h-full flex flex-1 flex-col gap-4 sm:gap-6  pb-24 sm:pb-0  h-full">
              <ContentCustomTest
                isMobile={isMobile}
                testId={Number(testId ?? -1)}
                turn={Number(turn ?? 1)}
                appInfo={appInfos}
                isCreate={isCreate === 'true'}
              />
              <BannerDownloadApp appInfo={appInfos} isMobile={isMobile} />
              {dataSeo.content && (
                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                  <SeoContent content={dataSeo.content} />
                </div>
              )}
            </WrapperAnimation>
          </Grid2>
        </Grid2>
      </MyContainer>
    </Fragment>
  );
}
