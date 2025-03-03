'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ExplanationDetail from '@ui/components/explanation';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import { db } from '@ui/db';
import { IAppInfo } from '@ui/models';
import { ITestsHomeJson, ITopicHomeJson } from '@ui/models/other';
import { IGameMode } from '@ui/models/tests/tests';
import { resetStateStudy, selectTopics } from '@ui/redux/features/study';
import initLearnQuestionThunk from '@ui/redux/repository/game/initData/initLearningQuestion';
import initPracticeThunk from '@ui/redux/repository/game/initData/initPracticeTest';
import selectSubTopicThunk from '@ui/redux/repository/study/select';
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
  id,
  data,
  subId,
  partId,
  appInfo,
  isMobile,
  slug,
}: {
  type: IGameMode;
  id?: number;
  data: IDataJsonHomePage;
  appInfo: IAppInfo;
  subId?: number;
  isMobile: boolean;
  partId?: number;
  slug?: string;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetStateStudy());
    const handleGetData = async () => {
      try {
        if (type === 'learn') {
          if (partId) {
            dispatch(
              initLearnQuestionThunk({
                partId: partId,
              })
            );
            return;
          }
          const currentPart = await db?.topics
            .where('slug')
            .equals(slug || '')
            .filter((item) => item.status === 0)
            .first();

          if (currentPart) {
            dispatch(
              initLearnQuestionThunk({
                partId: currentPart.id,
              })
            );
            setTimeout(() => {
              dispatch(selectSubTopicThunk(currentPart.parentId));
              dispatch(selectTopics(id || -1));
            }, 500);
          }
        }

        if (type === 'practiceTests') {
          if (!id || id === -1) {
            const list = await db?.testQuestions
              .where('gameMode')
              .equals('practiceTests')
              .toArray();

            if (list?.length) {
              const currentTest = list.find((item) => item.status === 0);
              if (currentTest) {
                dispatch(initPracticeThunk({ testId: currentTest.id }));
              }
            }
          }
        }
      } catch (err) {
      } finally {
      }
    };
    handleGetData();
  }, []);

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

        <BottomActions type={type} isMobile={isMobile} />
      </div>
    </Fragment>
  );
};

export default React.memo(MainStudyView);
