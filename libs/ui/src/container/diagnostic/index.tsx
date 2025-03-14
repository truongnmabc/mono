'use client';

import ChoicesPanel from '@ui/components/choicesPanel';
import Explanation from '@ui/components/explanation';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import TitleQuestion from '@ui/components/titleQuestion';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import dynamic from 'next/dynamic';

import BottomActions from '@ui/components/bottomActions';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { IAppInfo } from '@ui/models/app';
import { IGameMode } from '@ui/models/tests/tests';
import { selectHasRetakenDiagnosticTest } from '@ui/redux';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useEffect } from 'react';
import EmotionComponent from './emotion/emotionComponent';
import TimeTestGetLever from './timeTest';
const ClockIcon = dynamic(() => import('@ui/components/icon/ClockIcon'), {
  ssr: false,
});
const CountTimeDiagnostic = dynamic(() => import('./countTimeRemain'), {
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
const DiagnosticContainer = ({
  isMobile,
  type,
  testId,
  turn,
  appInfo,
}: {
  isMobile: boolean;
  type?: IGameMode;
  testId?: number;
  turn?: number;
  appInfo: IAppInfo;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleGetData = async () => {
      try {
        const result = (await dispatch(
          initDataGame({ type: 'diagnosticTest', turn, testId })
        )) as unknown as InitDataGameReturn;
        if (result.payload?.isCompleted) {
          const { resultId, attemptNumber } = result.payload;
          const param = queryString.stringify({
            resultId: resultId,
            attemptNumber: attemptNumber,
            gameMode: TypeParam.diagnosticTest,
          });
          setTimeout(() => {
            router.replace(`${RouterApp.ResultTest}?${param}`);
          }, 250);
        }
      } catch (err) {
        console.log('🚀 ~ handleGetData ~ err:', err);
      }
    };
    handleGetData();
  }, [testId, type, turn]);

  return (
    <div className=" sm:shadow-custom bg-transparent min-h-[420px] sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4  flex flex-col gap-3">
        <TitleQuestion title="Diagnostic Test" />
        <ProgressQuestion />
        {isMobile && (
          <div className="flex items-center justify-center w-full gap-2">
            <ClockIcon />
            <CountTimeDiagnostic testId={testId} />
          </div>
        )}
        <div
          className="bg-white flex flex-col rounded-lg p-3"
          style={{
            boxShadow: isMobile ? '0px 4px 20px 0px #2121211A' : 'none',
          }}
        >
          <TimeTestGetLever isMobile={isMobile} />
          <QuestionContent
            showStatus={false}
            showShadow={false}
            appInfo={appInfo}
            isMobile={isMobile}
            type={type as IGameMode}
          />
          <EmotionComponent />
        </div>
        <ChoicesPanel type={type as IGameMode} />
        <ExplanationWrapper />
      </div>

      <BottomActions isMobile={isMobile} type="diagnosticTest" />
    </div>
  );
};
export default DiagnosticContainer;

const ExplanationWrapper = () => {
  const hasRetaken = useAppSelector(selectHasRetakenDiagnosticTest);
  return <Explanation unLock={!hasRetaken} />;
};
