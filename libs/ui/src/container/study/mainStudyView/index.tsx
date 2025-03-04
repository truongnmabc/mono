'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ExplanationDetail from '@ui/components/explanation';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import { IAppInfo } from '@ui/models';
import { ITestsHomeJson, ITopicHomeJson } from '@ui/models/other';
import { IGameMode } from '@ui/models/tests/tests';
import { resetStateStudy, selectTopics } from '@ui/redux/features/study';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { useAppDispatch } from '@ui/redux/store';
import dynamic from 'next/dynamic';
import React, { Fragment, useEffect } from 'react';

const TitleQuestion = dynamic(() => import('@ui/components/titleQuestion'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex bg-white rounded-md items-center justify-center h-8"></div>
  ),
});

const CountTimeRemainPracticeTest = dynamic(
  () => import('@ui/container/study/countTimeTest'),
  {
    ssr: false,
  }
);

const ClockIcon = dynamic(() => import('@ui/components/icon/ClockIcon'), {
  ssr: false,
});

interface IDataJsonHomePage {
  topics: ITopicHomeJson[];
  tests: ITestsHomeJson['practiceTests'];
}
const MainStudyView = ({
  type,
  topicId,
  partId,
  testId,
  appInfo,
  isMobile,
  slug,
  turn,
}: {
  type: IGameMode;
  appInfo: IAppInfo;
  subId?: number;
  isMobile: boolean;
  partId?: number;
  topicId?: number;
  testId?: number;
  slug?: string;
  turn?: number;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetStateStudy());

    const handleGetData = async () => {
      try {
        dispatch(initDataGame({ partId, type, slug, turn, testId, topicId }));
      } catch (err) {
        console.log('🚀 ~ handleGetData ~ err:', err);
      } finally {
      }
    };
    handleGetData();
  }, [testId, slug, type, partId, topicId, turn]);

  return (
    <Fragment>
      <div className="sm:shadow-custom bg-transparent min-h-[380px] relative sm:bg-white  rounded-2xl dark:bg-black">
        <div className="sm:p-4 flex flex-col gap-3">
          <TitleQuestion type={type} />

          <ProgressQuestion />
          {type !== 'learn' && (
            <div className="w-full flex items-center justify-center">
              <div className="flex items-center justify-center w-fit gap-2">
                <ClockIcon />
                <CountTimeRemainPracticeTest />
              </div>
            </div>
          )}
          <QuestionContent showStatus={type === 'learn'} />
          <ChoicesPanel />
          <ExplanationDetail />
        </div>

        <BottomActions
          type={type}
          isMobile={isMobile}
          topicId={topicId}
          testId={testId}
          partId={partId}
          slug={slug}
        />
      </div>
    </Fragment>
  );
};

export default React.memo(MainStudyView);
