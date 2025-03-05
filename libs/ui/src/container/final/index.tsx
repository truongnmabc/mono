'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ClockIcon from '@ui/components/icon/ClockIcon';
import AnswerSheet from '@ui/components/listLeftQuestions';
import ModalUnlock from '@ui/components/modalUnlock';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import TitleQuestion from '@ui/components/titleQuestion';
import { IAppInfo } from '@ui/models/app';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useEffect } from 'react';
import CountTimeFinalTest from './countTimeFinal';
const FinalTestContainer = ({
  isMobile,
  type,
  id,
  turn,
  appInfos,
}: {
  isMobile: boolean;
  type?: string;
  id?: number;
  turn?: number;
  appInfos: IAppInfo;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleGetData = async () => {
      const testId = id;
      try {
        dispatch(initDataGame({ type: 'finalTests', turn, testId }));
      } catch (err) {
        console.log('🚀 ~ handleGetData ~ err:', err);
      }
    };
    handleGetData();
  }, [id, type, turn]);
  return (
    <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4 flex flex-1 overflow-auto flex-col gap-3">
        <TitleQuestion
          title={`Full-Length ${appInfos.appName} Practice Test`}
        />
        <ProgressQuestion isActions />
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center justify-center w-fit gap-2">
            <ClockIcon />
            <CountTimeFinalTest />
          </div>
        </div>
        <QuestionContent showStatus={false} showQuestionsCount />
        <ChoicesPanel isActions />
      </div>

      <BottomActions type="finalTests" isMobile={isMobile} />
      <ModalUnlock />
    </div>
  );
};

export default FinalTestContainer;

export const HandleSelectAnswer = () => {
  const userInfo = useAppSelector(selectUserInfo);
  return (
    <AnswerSheet
      isCenter
      isActions
      shouldUnlocked={userInfo.isPro ? 'true' : 'false'}
      defaultQuestionCount={225}
    />
  );
};
