import {
  ONE_MONTH_PRO,
  ONE_TIME_PRO,
  ONE_WEEK_PRO,
  ONE_YEAR_PRO,
  SUBSCRIPTION,
} from '../constant';
import { parseJSONdata } from '../json';

// Types
export interface IOneWeek {
  planId: string;
  price: number;
}

export interface IPriceConfig extends IOneWeek {
  type: string;
  trialDay: number | null;
  averagePrice: number;
  savePrice: {
    text: string;
    percent: number;
  };
  initPrice: number | null;
}

export interface IResult {
  type: string;
  // prices: (IPriceConfig | { price: IOneWeek })[];
  prices: IPriceConfig[];
}

export const getAveragePrice = (value: number, days: number): number => {
  return value && days ? parseFloat((value / days).toFixed(2)) : 1;
};

const getInitPrice = (value: number, percent: number): number => {
  return Math.ceil(value / ((100 - percent) / 100));
};

// Main function
export const getConfigProV2 = (appInfo: IAppInfo): IResult => {
  const result: IResult = {
    type: SUBSCRIPTION,
    prices: [],
  };

  try {
    const oneWeek = parseJSONdata<IOneWeek>(appInfo[ONE_WEEK_PRO]);
    const oneMonth = parseJSONdata<IOneWeek>(appInfo[ONE_MONTH_PRO]);
    const oneYear = parseJSONdata<IOneWeek>(appInfo[ONE_YEAR_PRO]);
    const oneTime = parseJSONdata<IOneWeek>(appInfo[ONE_TIME_PRO]);

    if (oneWeek && oneMonth && oneYear) {
      // Calculate average prices
      const averagePrices = {
        week: getAveragePrice(oneWeek.price, 7),
        month: getAveragePrice(oneMonth.price, 30),
        year: getAveragePrice(oneYear.price, 365),
      };

      // Calculate savings
      const savePercents = {
        week: 0,
        month: Math.floor(
          ((averagePrices.week - averagePrices.month) / averagePrices.week) *
            100
        ),
        year: Math.floor(
          ((averagePrices.week - averagePrices.year) / averagePrices.week) * 100
        ),
      };

      // Push subscription plans
      result.prices.push(
        createPriceConfig(
          oneWeek,
          '1 week',
          null,
          averagePrices.week,
          'Basic',
          savePercents.week,
          null
        ),
        createPriceConfig(
          oneMonth,
          '1 month',
          3,
          averagePrices.month,
          'Popular',
          savePercents.month,
          getInitPrice(oneMonth.price, savePercents.month)
        ),
        createPriceConfig(
          oneYear,
          '1 year',
          3,
          averagePrices.year,
          'Most economical',
          savePercents.year,
          getInitPrice(oneYear.price, savePercents.year)
        )
      );

      // Development mode mock data
      if (process.env['NODE_ENV'] === 'development') {
        mockPlanIds(result.prices as IPriceConfig[]);
      }
    } else if (oneTime) {
      // *NOTE: oneTime hiện chưa check
      // result.type = ONETIME;
      // result.prices.push({ price: oneTime });
    }
  } catch {
    // Handle errors silently
  }

  return result;
};

// Helper functions
const createPriceConfig = (
  plan: IOneWeek,
  type: string,
  trialDay: number | null,
  averagePrice: number,
  saveText: string,
  savePercent: number,
  initPrice: number | null
): IPriceConfig => ({
  ...plan,
  type,
  trialDay,
  averagePrice,
  savePrice: {
    text: saveText,
    percent: savePercent,
  },
  initPrice,
});

const mockPlanIds = (prices: IPriceConfig[]) => {
  prices[0].planId = 'P-5GE18939GM962423UMQVLK5Y';
  prices[1].planId = 'P-2SH95524CM0826016MQVLLUI';
  prices[2].planId = 'P-1VY99078S4786524AMQVLL4A';
};

export const isSubscriptionId = (str: string) => {
  const regex = /\b[\dA-Z-]{13}\b/gm;
  return regex.exec(str) !== null;
};

type ConfigAppItem = {
  questionNumber?: string | number;
  price?: string;
  value?: number;
  configName?: string;
  iapLockTest?: number;
  iapLockPart?: number;
  valueBasic?: number | string;
  priceBasic?: string | number;
  valuePro?: number | string;
  pricePro?: string | number;
  subscription?:
    | {
        basic: string;
        pro: string;
      }
    | boolean;
  devSubscription?: {
    basic: string;
    pro: string;
  };
  noTrialSubscription?: {
    basic: string;
    pro: string;
  };
  newPrice?: INewPrice[];
  ebook?: Array<{
    name?: string;
    urlDownload?: string;
    image?: string;
  }>;
};

type INewPrice = {
  salePrice?: number;
  price?: number | null;
  type?: string;
  averagePrice?: number;
  trialDay?: number;
  savePrice?: {
    text?: string;
    percent?: number;
  } | null;
  planId?: string;
};

type ConfigApp = {
  [key: string]: ConfigAppItem;
};

import { IAppInfo } from '@shared-models/app';
import config_new_pro from 'data/config_new_pro.json';
const configNewPro: ConfigApp = config_new_pro.configApp;

export const getConfigAppPro = (appShortName: string) => {
  if (config_new_pro && config_new_pro.configApp) {
    return configNewPro[appShortName];
  }
  return undefined;
};
