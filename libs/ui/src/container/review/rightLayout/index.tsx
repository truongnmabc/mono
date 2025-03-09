import { IModeReview, ITopicHomeJson } from '@ui/models/other';
import { Grid2 } from '@mui/material';
import WrapperAnimation from '@ui/container/study/mainStudyView/wrapperAnimationRight';
import BannerDownloadApp from '@ui/components/bannerDownload';
import { IAppInfo } from '@ui/models/app';
import SeoContent from '@ui/components/seoContent';
import ContentReviewLayoutRight from './content';

const RightLayout = ({
  isMobile,
  mode,
  appInfo,
  content,
  isReady,
  topics,
}: {
  isMobile: boolean;
  mode: IModeReview;
  appInfo: IAppInfo;
  content: string;
  isReady: boolean;
  topics: ITopicHomeJson[];
}) => {
  return (
    <Grid2
      size={{
        sm: 9,
        xs: 12,
      }}
    >
      <WrapperAnimation>
        <div className="w-full h-full flex flex-col gap-4 sm:gap-6 ">
          <ContentReviewLayoutRight
            mode={mode}
            isReady={isReady}
            isMobile={isMobile}
            topics={topics}
          />
          <BannerDownloadApp appInfo={appInfo} isMobile={isMobile} />
          {content && (
            <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
              <SeoContent content={content} />
            </div>
          )}
        </div>
      </WrapperAnimation>
    </Grid2>
  );
};

export default RightLayout;
