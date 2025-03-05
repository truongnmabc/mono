'use client';
import MyContainer from '@ui/components/container';
import { IAppInfo } from '@ui/models/app';
import { getImageSrc } from '@ui/utils/image';
import Image from 'next/image';

import { MtUiButton } from '@ui/components/button';
import {
  createPriceConfig,
  getAveragePrice,
  getInitPrice,
} from '@ui/utils/paypal';
import clsx from 'clsx';
import { useState } from 'react';

export type IPlan = {
  planId: string;
  price: number;
  initPrice?: number | null;
  type: string;
  averagePrice: number;
  trialDay?: number | null;
  savePrice?: {
    text?: string;
    percent?: number;
  };
};

const Item = ({
  plan,
  isActive,
  icon,
  setActivePlan,
  isMobile,
}: {
  plan: IPlan;
  isActive: boolean;
  icon: string;
  setActivePlan: (plan: IPlan) => void;
  isMobile: boolean;
}) => {
  const {
    price: salePrice = 0,
    initPrice = 0,
    type = '',
    averagePrice = 0,
    trialDay = 0,
    savePrice = {},
  } = plan;
  return (
    <div
      className={clsx(
        'flex p-[2px] sm:p-1 flex-col w-full relative  transition-all duration-300 cursor-pointer group hover:border-primary  bg-white rounded-2xl  border border-solid',
        {
          'border-2 border-[#EEAF56] sm:h-[298px]': isActive,
          'sm:h-[266px]': !isActive,
        }
      )}
      onClick={() => setActivePlan(plan)}
    >
      {isActive && (
        <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 sm:w-12 sm:h-12 w-6 h-6">
          <Image
            src={icon}
            alt="icon"
            width={isMobile ? 24 : 48}
            height={isMobile ? 24 : 48}
          />
        </div>
      )}
      {savePrice?.text && isMobile && (
        <p
          className={clsx(
            'text-[8px] sm:text-xl font-semibold text-center text-white  rounded-t-xl group-hover:bg-primary justify-between px-4 py-2',
            {
              'bg-primary': isActive,
              'bg-[#9D8A6B]': !isActive,
            }
          )}
        >
          {savePrice?.text}
        </p>
      )}

      <div className=" flex-1 sm:p-4 pb-4 sm:pb-0 p-2">
        <div
          className={clsx('flex items-center  justify-center gap-2', {
            'sm:pt-4 pt-2': isActive,
            'sm:pt-2 pt-1': !isActive,
          })}
        >
          <span className="text-lg sm:text-[36px]  font-semibold ">
            ${salePrice}
          </span>
          {initPrice && initPrice > 0 && (
            <span className="text-[10px] sm:text-2xl font-medium line-through text-[#21212185] ">
              ${initPrice}
            </span>
          )}
        </div>
        <p className="text-[8px] sm:text-base font-medium text-center uppercase text-[#21212152]">
          {type}
        </p>
        <div className="h-px bg-gray-200 w-full my-2 sm:my-4"></div>
        <div className="text-center">
          <span className="text-xs sm:text-xl font-medium">Just </span>
          <b className="text-[#212121] text-lg sm:text-2xl font-semibold">
            ${averagePrice}
          </b>
          {isMobile ? (
            <p className="text-[8px]  text-gray-500 ml-1">per day</p>
          ) : (
            <span className="text-[8px] sm:text-base text-gray-500 ml-1">
              / day
            </span>
          )}
        </div>
        {trialDay && trialDay > 0 ? (
          <div className="text-center text-[8px]  sm:text-base mt-2 text-primary ">
            <span className="text-primary">{trialDay}-days</span>{' '}
            <b className="text-[#EEAF56]">FREE</b> trial
          </div>
        ) : (
          <div className="h-6 w-full "></div>
        )}
      </div>

      {!isMobile && savePrice?.text && (
        <div
          className={clsx(
            'flex items-center  rounded-b-xl group-hover:bg-primary justify-between px-4 py-2',
            {
              'bg-primary': isActive,
              'bg-[#9D8A6B]': !isActive,
            }
          )}
        >
          <p className="text-xl font-semibold text-white ">{savePrice?.text}</p>
          <p className="text-base text-white font-medium">
            save{' '}
            <span className="text-white text-base font-semibold">
              {savePrice?.percent}%
            </span>
          </p>
        </div>
      )}
      {isMobile && savePrice?.text && (
        <div className=" absolute -bottom-2 left-0 right-0  z-10">
          <p className="text-[8px] px-2 py-1 mx-auto bg-[#9D8A6B]  w-fit rounded text-white font-medium">
            save{' '}
            <span className="text-white text-[8px] font-semibold">
              {savePrice?.percent}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default function Pricing({
  appInfo,
  isMobile,
}: {
  appInfo: IAppInfo;
  isMobile: boolean;
}) {
  const averagePrices = {
    week: getAveragePrice(appInfo?.oneWeekPro?.price ?? 0, 7),
    month: getAveragePrice(appInfo?.oneMonthPro?.price ?? 0, 30),
    year: getAveragePrice(appInfo?.oneYearPro?.price ?? 0, 365),
  };
  const savePercents = {
    week: 0,
    month: Math.floor(
      ((averagePrices.week - averagePrices.month) / averagePrices.week) * 100
    ),
    year: Math.floor(
      ((averagePrices.week - averagePrices.year) / averagePrices.week) * 100
    ),
  };
  const defaultPlan = { planId: '', price: 0 };
  const listPlan = {
    oneWeek: createPriceConfig(
      appInfo?.oneWeekPro ?? defaultPlan,
      '1 week',
      null,
      averagePrices.week,
      'Basic',
      savePercents.week,
      getInitPrice(appInfo?.oneWeekPro?.price ?? 0, savePercents.week)
    ),
    oneMonth: createPriceConfig(
      appInfo?.oneMonthPro ?? defaultPlan,
      '1 month',
      3,
      averagePrices.month,
      'Popular',
      savePercents.month,
      getInitPrice(appInfo?.oneMonthPro?.price ?? 0, savePercents.month)
    ),
    oneYear: createPriceConfig(
      appInfo?.oneYearPro ?? defaultPlan,
      '1 year',
      3,
      averagePrices.year,
      'Most economical',
      savePercents.year,
      getInitPrice(appInfo?.oneYearPro?.price ?? 0, savePercents.year)
    ),
  };

  const plans = Object.values(listPlan);
  const icon = getImageSrc('get-pro-icon-select-plan.png');
  const [activePlan, setActivePlan] = useState<IPlan>(plans[1]);
  return (
    <MyContainer>
      <div className="mt-12 flex items-center gap-4 sm:gap-14 justify-center">
        {plans.map((plan) => (
          <Item
            plan={plan as IPlan}
            isActive={plan.planId === activePlan.planId}
            icon={icon}
            setActivePlan={setActivePlan}
            key={plan.planId}
            isMobile={isMobile}
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <MtUiButton
          type="primary"
          size="large"
          block={isMobile ? true : false}
          className=" py-2 sm:py-4 px-28"
        >
          Upgrade Now
        </MtUiButton>
      </div>
      <p className="text-sm font-nomal mt-4 sm:mt-6 text-center text-[#21212152]">
        Subscriptions auto-renew at the cost of the chosen package, unless
        cancelled 24 hours in advance of the end of the current period. The
        subscription fee is charged to your PayPal account upon purchase. You
        may manage your subscription and turn off auto-renewal by accessing your
        Account Settings after purchase. Per our policy, you cannot cancel your
        current subscription during the active subscription period. No refunds
        will be provided for any unused portion of the subscription term.
      </p>
    </MyContainer>
  );
}
