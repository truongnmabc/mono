import { IModeReview, ITopicHomeJson } from '@ui/models/other';
import { Fragment } from 'react';
import AllQuestions from './all';
import HardQuestions from './hard';
import RandomQuestions from './random';
import SavedQuestions from './saved';
import TitleReview from './title';
import WeakQuestions from './weak';

const ContentReviewLayoutRight = ({
  mode,
  isReady,
  isMobile,
  topics,
}: {
  mode: IModeReview;
  isReady: boolean;
  isMobile: boolean;
  topics: ITopicHomeJson[];
}) => {
  const componentMapping = {
    random: (
      <RandomQuestions
        isMobile={isMobile}
        mode={mode}
        topics={topics}
        isReady={isReady}
      />
    ),
    weak: (
      <WeakQuestions
        isMobile={isMobile}
        isReady={isReady}
        mode={mode}
        topics={topics}
      />
    ),
    hard: (
      <HardQuestions
        isReady={isReady}
        isMobile={isMobile}
        mode={mode}
        topics={topics}
      />
    ),
    saved: (
      <SavedQuestions
        isReady={isReady}
        isMobile={isMobile}
        mode={mode}
        topics={topics}
      />
    ),
    all: <AllQuestions isMobile={isMobile} />,
  };

  return (
    <Fragment>
      {!isMobile && <TitleReview mode={mode} isReady={isReady} />}
      {componentMapping[mode]}
    </Fragment>
  );
};

export default ContentReviewLayoutRight;
