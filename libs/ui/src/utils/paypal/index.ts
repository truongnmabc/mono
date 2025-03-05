import config_new_pro from './config_new_pro.json';
// Types
interface IOneWeek {
  planId: string;
  price: number;
}

interface IPriceConfig extends IOneWeek {
  type: string;
  trialDay: number | null;
  averagePrice: number;
  savePrice: {
    text: string;
    percent: number;
  };
  initPrice: number | null;
}

export const getAveragePrice = (value: number, days: number): number => {
  return value && days ? parseFloat((value / days).toFixed(2)) : 1;
};

export const getInitPrice = (value: number, percent: number): number => {
  return Math.ceil(value / ((100 - percent) / 100));
};

// Helper functions
export const createPriceConfig = (
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

const configNewPro: ConfigApp = config_new_pro.configApp;

export const getConfigAppPro = (appShortName: string) => {
  if (config_new_pro && config_new_pro.configApp) {
    return configNewPro[appShortName];
  }
  return undefined;
};
