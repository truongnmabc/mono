import LeftLayoutReview from './leftLayout';
import { IModeReview, ITopicHomeJson } from '@ui/models/other';
import RightLayout from './rightLayout';
import { Grid2 } from '@mui/material';
import { IAppInfo } from '@ui/models/app';

const ReviewLayout = ({
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
      container
      spacing={{ xs: 0, sm: 2 }}
      className="w-full sm:py-4 h-full pb-4"
    >
      <LeftLayoutReview isMobile={isMobile} mode={mode} isReady={isReady} />
      <RightLayout
        isMobile={isMobile}
        mode={mode}
        appInfo={appInfo}
        content={content}
        isReady={isReady}
        topics={topics}
      />
    </Grid2>
  );
};

export default ReviewLayout;
