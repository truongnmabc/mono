'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ClockIcon from '@ui/components/icon/ClockIcon';
import AnswerSheet from '@ui/components/listLeftQuestions';
import ModalUnlock from '@ui/components/modalUnlock';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import TitleQuestion from '@ui/components/titleQuestion';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import initFinalTestThunk from '@ui/redux/repository/game/initData/initFinalTest';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useEffect } from 'react';
import CountTimeFinalTest from './countTimeFinal';
import { db } from '@ui/db/model';
import { useRouter } from 'next/navigation';
const FinalTestContainer = ({
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
    const handleGetData = async () => {
      if (id) {
        dispatch(initFinalTestThunk({ id: Number(id) }));
      }
    };
    handleGetData();
  }, [id]);
  return (
    <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4 flex flex-1 overflow-auto flex-col gap-3">
        <TitleQuestion />
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
