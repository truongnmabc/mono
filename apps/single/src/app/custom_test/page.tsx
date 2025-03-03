import MyContainer from '@ui/components/container';
import { Fragment } from 'react';
import { Grid2 } from '@mui/material';
import BannerDownloadApp from '@ui/components/bannerDownload/bannerDownloadApp';
import SeoContent from '@ui/components/seoContent';
import LeftLayout from './_components/leftLayout';
import ContentCustomTest from './_components/contentCustomTest';
import HeaderMobile from '@ui/components/headerMobile';
import LoadDataCustomTest from './_components/loadDataCustomTest';
import { requestGetTitleSeoPage } from '@ui/services/titleSeo.service';

export default async function CustomPage() {
  const { content } = await requestGetTitleSeoPage('custom_test');

  return (
    <Fragment>
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
      <MyContainer className="py-4">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="w-full h-full">
          <Grid2
            size={{
              sm: 3,
              xs: 12,
            }}
          >
            <LeftLayout />
          </Grid2>
          <Grid2
            size={{
              sm: 9,
              xs: 12,
            }}
          >
            <div className="w-full  min-h-full flex flex-1 flex-col gap-4 sm:gap-6  pb-24 sm:pb-0  h-full">
              <ContentCustomTest />
              <BannerDownloadApp />
              {content && (
                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                  <SeoContent content={content} />
                </div>
              )}
            </div>
          </Grid2>
        </Grid2>
      </MyContainer>
      <LoadDataCustomTest />
    </Fragment>
  );
}
