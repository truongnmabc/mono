import Grid2 from '@mui/material/Grid2';
import appInfos from '@single/data/appInfos.json';
import data from '@single/data/server/dia.json';
import BannerDownloadApp from '@ui/components/bannerDownload';
import MyContainer from '@ui/components/container';
import HeaderMobile from '@ui/components/headerMobile';
import SeoContent from '@ui/components/seoContent';
import FinalTestContainer, { HandleSelectAnswer } from '@ui/container/final';
import { IGameMode } from '@ui/models/tests/tests';
import { detectAgent } from '@ui/utils/device';
import { Metadata } from 'next';
import { headers } from 'next/headers';
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
      <MyContainer className="py-4">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="w-full h-full">
          {!isMobile && (
            <Grid2
              size={{
                sm: 3,
                xs: 0,
              }}
            >
              <HandleSelectAnswer />
            </Grid2>
          )}

          <Grid2
            size={{
              sm: 9,
              xs: 12,
            }}
          >
            <div className="w-full flex flex-1 flex-col gap-4 sm:gap-6 pb-24  sm:p-0  h-full">
              <FinalTestContainer
                isMobile={isMobile}
                type={type as IGameMode}
                id={Number(id) || -1}
                turn={Number(turn) || 1}
                appInfos={appInfos}
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
