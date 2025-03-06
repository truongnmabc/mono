'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ExplanationDetail from '@ui/components/explanation';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import RouterApp from '@ui/constants/router.constant';
import { IAppInfo } from '@ui/models';
import { IGameMode } from '@ui/models/tests/tests';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { useAppDispatch } from '@ui/redux/store';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
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
interface GameResult {
  isCompleted?: boolean;
  resultId?: number;
  currentSubTopicIndex?: string;
  attemptNumber?: number;
}
type InitDataGameReturn = {
  payload: GameResult;
  type: string;
  meta: {
    requestId: string;
    requestStatus: 'fulfilled' | 'rejected';
  };
};
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
  const router = useRouter();
  useEffect(() => {
    const handleGetData = async () => {
      try {
        const result = (await dispatch(
          initDataGame({ partId, type, slug, turn, testId, topicId })
        )) as unknown as InitDataGameReturn;
        if (result.payload?.isCompleted) {
          const { resultId, currentSubTopicIndex, attemptNumber } =
            result.payload;
          setTimeout(() => {
            router.replace(
              `${RouterApp.Finish}?topic=${slug}&resultId=${resultId}&index=${currentSubTopicIndex}&turn=${attemptNumber}`
            );
          }, 300);
        }

        console.log('🚀 ~ handleGetData ~ result:', result);
      } catch (err) {
        console.log('🚀 ~ handleGetData ~ err:', err);
      }
    };
    handleGetData();
  }, [testId, slug, type, partId, topicId, turn]);

  return (
    <Fragment>
      <div className="sm:shadow-custom bg-transparent min-h-[380px] relative sm:bg-white  rounded-2xl dark:bg-black">
        <div className="sm:p-4 flex flex-col gap-3">
          <TitleQuestion
            type={type}
            title={
              (type === 'practiceTests'
                ? slug
                    ?.replace('-practice-test', ' ')
                    .replace(appInfo.appShortName, '')
                    .replaceAll('-', ' ')
                : slug?.replaceAll('-', ' ')) || ''
            }
          />

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
