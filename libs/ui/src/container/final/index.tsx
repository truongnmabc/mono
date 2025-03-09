'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ClockIcon from '@ui/components/icon/ClockIcon';
import AnswerSheetFinal from './listQuestion';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import TitleQuestion from '@ui/components/titleQuestion';
import { IAppInfo } from '@ui/models/app';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useEffect } from 'react';
import CountTimeFinalTest from './countTimeFinal';
import queryString from 'query-string';
import RouterApp from '@ui/constants/router.constant';
import { useRouter } from 'next/navigation';
import { IGameMode } from '@ui/models/tests/tests';
import { TypeParam } from '@ui/constants';
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
const FinalTestContainer = ({
  isMobile,
  type,
  testId,
  turn,
  appInfos,
}: {
  isMobile: boolean;
  type?: string;
  testId?: number;
  turn?: number;
  appInfos: IAppInfo;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const handleGetData = async () => {
      try {
        const result = (await dispatch(
          initDataGame({ type: 'finalTests', turn, testId })
        )) as unknown as InitDataGameReturn;
        if (result.payload?.isCompleted) {
          const { resultId, attemptNumber } = result.payload;
          const param = queryString.stringify({
            resultId: resultId,
            gameMode: TypeParam.finalTests,
            attemptNumber: attemptNumber,
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
    <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4 flex flex-1 overflow-auto flex-col gap-3">
        <TitleQuestion
          title={`Full-Length ${appInfos.appName} Practice Test`}
        />
        <ProgressQuestion isActions />
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center justify-center w-fit gap-2">
            <ClockIcon />
            <CountTimeFinalTest testId={testId || -1} />
          </div>
        </div>
        <QuestionContent
          showStatus={false}
          showQuestionsCount
          appInfo={appInfos}
          isMobile={isMobile}
          type={type as IGameMode}
        />
        <ChoicesPanel isActions type={type as IGameMode} />
      </div>

      <BottomActions type="finalTests" isMobile={isMobile} />
    </div>
  );
};

export default FinalTestContainer;

export const HandleSelectAnswer = () => {
  const userInfo = useAppSelector(selectUserInfo);
  return (
    <AnswerSheetFinal
      isCenter
      isActions
      shouldUnlocked={userInfo.isPro ? 'true' : 'false'}
      defaultQuestionCount={225}
    />
  );
};
