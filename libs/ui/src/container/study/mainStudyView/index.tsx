'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ExplanationDetail from '@ui/components/explanation';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import TitleQuestion from '@ui/components/titleQuestion';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { IAppInfo } from '@ui/models';
import { IGameMode } from '@ui/models/tests/tests';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { useAppDispatch } from '@ui/redux/store';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import React, { useEffect } from 'react';

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
  index?: string;
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
          initDataGame({
            partId: partId === -1 ? undefined : partId,
            type,
            slug,
            turn,
            testId: testId === -1 ? undefined : testId,
            topicId: topicId === -1 ? undefined : topicId,
          })
        )) as unknown as InitDataGameReturn;

        if (result.payload?.isCompleted) {
          const { resultId, index, attemptNumber } = result.payload;
          const param = queryString.stringify({
            resultId: resultId,
            index: index,
            attemptNumber: attemptNumber,
            topic: type === TypeParam.learn ? slug : undefined,
            gameMode: type === TypeParam.learn ? undefined : type,
          });
          setTimeout(() => {
            router.replace(
              `${
                type === TypeParam.learn
                  ? RouterApp.Finish
                  : RouterApp.ResultTest
              }?${param}`
            );
          }, 250);
        }
      } catch (err) {
        console.log('🚀 ~ handleGetData ~ err:', err);
      }
    };
    handleGetData();
  }, [testId, slug, type, partId, topicId, turn]);

  return (
    <div className="sm:shadow-custom bg-transparent min-h-[380px] relative sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4 flex flex-col gap-3">
        <TitleQuestion
          type={type}
          title={
            (type === TypeParam.practiceTests
              ? 'Practice Test'
              : slug?.replaceAll('-', ' ')) || ''
          }
        />

        <ProgressQuestion />
        {type !== TypeParam.learn && (
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center justify-center w-fit gap-2">
              <ClockIcon />
              <CountTimeRemainPracticeTest />
            </div>
          </div>
        )}
        <QuestionContent
          type={type}
          showStatus={type === TypeParam.learn}
          appInfo={appInfo}
          isMobile={isMobile}
        />
        <ChoicesPanel type={type} />
        <ExplanationDetail isMobile={isMobile} />
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
  );
};

export default React.memo(MainStudyView);
