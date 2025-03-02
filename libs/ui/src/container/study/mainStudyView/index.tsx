'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ExplanationDetail from '@ui/components/explanation';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import React, { Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch } from '@ui/redux/store';
import { IGameMode, ITestBase } from '@ui/models/tests/tests';
import { IAppInfo } from '@ui/models';
import { ITopicHomeProps } from '@ui/components/home/gridTopic/gridTopics';
import Loading from '@ui/components/loading';
import initLearnQuestionThunk from '@ui/redux/repository/game/initData/initLearningQuestion';
import { db } from '@ui/db';
import { ITestsHomeJson } from '@ui/models/other';

const TitleQuestion = dynamic(() => import('@ui/components/titleQuestion'), {
  ssr: false,
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
  topics: ITopicHomeProps[];
  tests: ITestsHomeJson['practiceTests'];
}
const MainStudyView = ({
  type,
  id,
  data,
  subId,
  partId,
  appInfo,
  isMobile,
}: {
  type: IGameMode;
  id?: number;
  data: IDataJsonHomePage;
  appInfo: IAppInfo;
  subId?: number;
  isMobile: boolean;
  partId?: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleGetData = async () => {
      try {
        if (type === 'learn') {
          if (partId && subId) {
            dispatch(
              initLearnQuestionThunk({
                partId: partId,
                subTopicId: subId,
              })
            );
            return;
          }
          const currentTopic = await db?.topics.get(id);
          if (currentTopic) {
            const currentSubTopic = currentTopic.topics.find(
              (item) => item.status === 0
            );
            if (currentSubTopic) {
              const currentPart = currentSubTopic.topics.find(
                (item) => item.status === 0
              );
              if (currentPart) {
                dispatch(
                  initLearnQuestionThunk({
                    partId: currentPart.id,
                    subTopicId: currentSubTopic.id,
                  })
                );
              }
            }
          }
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    handleGetData();
  }, []);

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center h-1/4">
        <Loading />
      </div>
    );
  return (
    <Fragment>
      <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
        <div className="sm:p-4 flex flex-col gap-3">
          {type && <TitleQuestion type={type} />}
          <ProgressQuestion />
          {type === 'practiceTests' && (
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

        <BottomActions type={type} isMobile={isMobile} />
      </div>
    </Fragment>
  );
};

export default React.memo(MainStudyView);
