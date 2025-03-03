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
}: {
  isMobile: boolean;
  type?: string;
  id?: string;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (id) {
      dispatch(initDiagnosticTestQuestionThunk({ id: Number(id) }));
    }
  }, [id]);

  return (
    <div className=" sm:shadow-custom bg-transparent min-h-[420px] sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4  flex flex-col gap-3">
        <TitleQuestion />
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
