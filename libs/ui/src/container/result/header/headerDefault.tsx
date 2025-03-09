import React from 'react';
import { IconFailResultTest } from '../icon/iconFailResultTest';
import { IconPassResultTest } from '../icon/iconPassResultTest';
import DashboardCard from './chartHeader';
import { TitleMiss, TitlePass } from './titleResultTest';
import CloseIcon from '@ui/asset/icon/CloseIcon';
import { MtUiButton } from '@ui/components/button';
import MyContainer from '@ui/components/container';
import { TypeParam } from '@ui/constants';
import { IGameMode } from '@ui/models/tests/tests';
import Link from 'next/link';
import RouterApp from '@ui/constants/router.constant';
const HeaderDefault = ({
  isPass,
  correct,
  total,
  passing,
  handleTryAgain,
  handleNextTets,
  type,
  isLast,
}: {
  isPass: boolean;
  correct: number;
  total: number;
  passing: number;
  handleTryAgain: () => void;
  handleNextTets: () => void;
  type: IGameMode;
  isLast: boolean;
}) => {
  return (
    <MyContainer className="py-4 sm:py-8 flex flex-col sm:flex-row sm:gap-8">
      <Link href={RouterApp.Home}>
        <div className="w-10 h-10 rounded-full cursor-pointer bg-[#21212114] sm:bg-white flex items-center justify-center">
          <CloseIcon />
        </div>
      </Link>

      <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-10 items-end">
        <div className="w-full flex justify-center sm:w-[234px] sm:h-[232px]">
          {isPass ? <IconPassResultTest /> : <IconFailResultTest />}
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-hidden justify-between h-full sm:pt-16">
          <div className="flex-1">{isPass ? <TitlePass /> : <TitleMiss />}</div>
          <div className="fixed bottom-0 py-4 px-4 left-0 right-0 z-50 bg-theme-dark sm:bg-transparent sm:static flex gap-4 sm:gap-6 items-center">
            {type !== TypeParam.review && (
              <MtUiButton
                className="sm:py-4 sm:max-h-14 text-lg bg-white font-medium rounded-2xl text-primary border-primary"
                block
                size="large"
                onClick={handleTryAgain}
              >
                Try Again
              </MtUiButton>
            )}
            {(((type === TypeParam.practiceTests ||
              type === TypeParam.branchTest) &&
              !isLast) ||
              type === TypeParam.customTests) && (
              <MtUiButton
                className="sm:py-4 sm:max-h-14 text-lg font-medium rounded-2xl "
                block
                type="primary"
                size="large"
                onClick={handleNextTets}
              >
                {type === TypeParam.customTests ? 'New Test' : 'Continue'}
              </MtUiButton>
            )}
          </div>
        </div>
        <DashboardCard
          correct={correct}
          total={total}
          percent={(correct / total) * 100}
          passing={passing}
        />
      </div>
    </MyContainer>
  );
};

export default HeaderDefault;
