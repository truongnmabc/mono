'use client';
import BottomActions from '@ui/components/bottomActions';
import ChoicesPanel from '@ui/components/choicesPanel';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { IAppInfo } from '@ui/models/app';
import { IGameMode } from '@ui/models/tests/tests';
import {
  selectCurrentSubTopicIndex,
  selectGameDifficultyLevel,
} from '@ui/redux/features/game.reselect';
import initDataGame from '@ui/redux/repository/game/initData/initData';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import CountTimeCustomTest from '../countTimeCustomTest';
const ExplanationDetail = dynamic(() => import('@ui/components/explanation'), {
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
const ContentCustomTest = ({
  isMobile,
  testId,
  turn,
  appInfo,
  isCreate,
}: {
  isMobile: boolean;
  testId: number;
  turn?: number;
  appInfo: IAppInfo;
  isCreate: boolean;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const handleGetData = async () => {
      const result = (await dispatch(
        initDataGame({
          type: TypeParam.customTests as IGameMode,
          turn,
          testId: testId === -1 ? undefined : testId,
          isCreate,
        })
      )) as unknown as InitDataGameReturn;

      if (result.payload?.isCompleted) {
        const { attemptNumber, resultId } = result.payload;

        const param = queryString.stringify({
          gameMode: TypeParam.customTests,
          resultId: resultId,
          attemptNumber: attemptNumber,
        });
        setTimeout(() => {
          router.replace(`${RouterApp.ResultTest}?&${param}`);
        }, 250);
      }
    };

    handleGetData();
  }, [isCreate, router, dispatch, testId, turn]);

  return (
    <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4 flex flex-col gap-3">
        <WrapperTitleCustomTest />
        <WrapperProgressQuestion />
        <CountTimeCustomTest />
        <WrapperQuestionContent appInfo={appInfo} isMobile={isMobile} />
        <WrapperChoicesPanel />
        <WrapperExplanationDetail />
      </div>

      <BottomActions type={TypeParam.customTests} isMobile={isMobile} />
    </div>
  );
};

export default React.memo(ContentCustomTest);

const WrapperExplanationDetail = () => {
  const feedBack = useAppSelector(selectGameDifficultyLevel);
  if (feedBack !== 'newbie') return null;
  return <ExplanationDetail unLock />;
};

const WrapperChoicesPanel = () => {
  const feedBack = useAppSelector(selectGameDifficultyLevel);
  return (
    <ChoicesPanel
      type={TypeParam.customTests}
      isActions={feedBack === 'exam'}
    />
  );
};

const WrapperQuestionContent = ({
  appInfo,
  isMobile,
}: {
  appInfo: IAppInfo;
  isMobile: boolean;
}) => {
  const feedBack = useAppSelector(selectGameDifficultyLevel);
  return (
    <QuestionContent
      type={TypeParam.customTests}
      showStatus={feedBack === 'newbie'}
      appInfo={appInfo}
      isMobile={isMobile}
    />
  );
};

const WrapperProgressQuestion = () => {
  const feedBack = useAppSelector(selectGameDifficultyLevel);
  return <ProgressQuestion isActions={feedBack === 'exam'} />;
};

const WrapperTitleCustomTest = () => {
  const index = useAppSelector(selectCurrentSubTopicIndex);
  return (
    <div className="w-full hidden sm:block text-center capitalize text-xl font-semibold">
      Custom Test {index + 1}
    </div>
  );
};
