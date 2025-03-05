'use client';

import ChoicesPanel from '@ui/components/choicesPanel';
import Explanation from '@ui/components/explanation';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import TitleQuestion from '@ui/components/titleQuestion';
import { initDiagnosticTestQuestionThunk } from '@ui/redux';
import { useAppDispatch } from '@ui/redux/store';
import dynamic from 'next/dynamic';

import BottomActions from '@ui/components/bottomActions';
import { useEffect } from 'react';
import EmotionComponent from './emotion/emotionComponent';
import TimeTestGetLever from './timeTest';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { IGameMode } from '@ui/models/tests/tests';
const ClockIcon = dynamic(() => import('@ui/components/icon/ClockIcon'), {
  ssr: false,
});
const CountTimeDiagnostic = dynamic(() => import('./countTimeRemain'), {
  ssr: false,
});

const DiagnosticContainer = ({
  isMobile,
  type,
  id,
  turn,
}: {
  isMobile: boolean;
  type?: IGameMode;
  id?: number;
  turn?: number;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleGetData = async () => {
      const testId = id;
      try {
        dispatch(initDataGame({ type: 'diagnosticTest', turn, testId }));
      } catch (err) {
        console.log('🚀 ~ handleGetData ~ err:', err);
      }
    };
    handleGetData();
  }, [id, type, turn]);

  return (
    <div className=" sm:shadow-custom bg-transparent min-h-[420px] sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4  flex flex-col gap-3">
        <TitleQuestion title="Diagnostic Test" />
        <ProgressQuestion />
        {isMobile && (
          <div className="flex items-center justify-center w-full gap-2">
            <ClockIcon />
            <CountTimeDiagnostic />
          </div>
        )}
        <div
          className="bg-white flex flex-col rounded-lg p-3"
          style={{
            boxShadow: isMobile ? '0px 4px 20px 0px #2121211A' : 'none',
          }}
        >
          <TimeTestGetLever isMobile={isMobile} />
          <QuestionContent showStatus={false} showShadow={false} />
          <EmotionComponent />
        </div>
        <ChoicesPanel />
        <Explanation />
      </div>

      <BottomActions isMobile={isMobile} type="diagnosticTest" />
    </div>
  );
};
export default DiagnosticContainer;
