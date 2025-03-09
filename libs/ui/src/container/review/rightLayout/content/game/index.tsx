import { useAppDispatch } from '@ui/redux/store';
import { IModeReview } from '@ui/models/other';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext } from 'react';
import BottomActions from '@ui/components/bottomActions';
import ProgressQuestion from '@ui/components/progressQuestion';
import QuestionContent from '@ui/components/question';
import ChoicesPanel from '@ui/components/choicesPanel';
import ExplanationDetail from '@ui/components/explanation';
import { IconSubmit } from '@ui/components/icon/iconSubmit';
import { selectAppInfo } from '@ui/redux/features/appInfo.reselect';
import { useAppSelector } from '@ui/redux';
import IconBack from '@ui/components/icon/iconBack';
import RouterApp from '@ui/constants/router.constant';
import { shouldOpenSubmitTest } from '@ui/redux/features/tests';

const ReviewGameContent = ({
  mode,
  isMobile,
}: {
  mode: IModeReview;
  isMobile: boolean;
}) => {
  const appInfo = useAppSelector(selectAppInfo);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBack = () => {
    router.push(RouterApp.Home);
  };

  const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));

  return (
    <div className="sm:shadow-custom bg-transparent sm:bg-white pb-12 sm:pb-0  rounded-2xl dark:bg-black">
      <div className="p-0 sm:p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between sm:justify-center ">
          <div className="sm:hidden" onClick={handleBack}>
            <IconBack />
          </div>
          <h3 className="text-xl capitalize font-semibold ">
            {mode} Questions
          </h3>
          <div className="sm:hidden" onClick={setOpenConfirm}>
            <IconSubmit />
          </div>
        </div>
        <ProgressQuestion />
        <QuestionContent type="review" appInfo={appInfo} isMobile={isMobile} />
        <ChoicesPanel type="review" />
        <ExplanationDetail isMobile={isMobile} />
      </div>
      <BottomActions type="review" isMobile={isMobile} />
    </div>
  );
};

export default React.memo(ReviewGameContent);
