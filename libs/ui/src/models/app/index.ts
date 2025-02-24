export const parseBoolean = (b: unknown): boolean => {
  if (b === null || b === undefined) return false;
  return b === true || b === 'true';
};
export type ITheme = 'light' | 'dark';
export type IDevice = 'mobile' | 'mobile-ios' | 'mobile-android' | 'desktop';

export interface IAppInfo {
  appId: number;
  appName: string;
  appNameId: string;
  appShortName: string;
  bucket: string;
  categoryId: string;
  descriptionSEO: string;
  keywordSEO: string;
  linkAndroid: string;
  linkIos: string;
  link?: string;
  rank_math_title?: string;
  title?: string;
  totalQuestion?: number;
  usingFeaturePro?: boolean;
  usingMathJax?: boolean | string;
  hasState?: boolean;
  icon?: string;
  oneMonthPro?: { planId: string; price: number };
  oneWeekPro?: { planId: string; price: number };
  oneYearPro?: { planId: string; price: number };
  oneTimePro?: { planId: string; price: number };
}

export interface IAppConfigData {
  gaId: string; // Google Analytics ID
  tagManagerId: string; // Google Tag Manager ID
  appId: number; // App ID, có thể là chuỗi hoặc null
  googleVerifyId: string; // Google Site Verification ID
  mainColor: string; // Màu chính
  mainColorBold: string; // Màu chính đậm
  mainBackgroundColor: string; // Màu nền chính
  mainBackgroundColorContact: string; // Màu back của contact
  linearGradientBanner: string; // banner download
  GA4ID: string; // Google Analytics 4 ID
  pageId: string; // Page ID (Facebook hoặc hệ thống khác)
  wpDomain: string; // Domain chính (WordPress hoặc khác)
  cookie: string; // Màu cho cookie banner
  bgColorStartTest: string; // Màu nền cho nút bắt đầu test
  bgColorCloseCookie: string; // Màu nền cho nút đóng cookie
  mainColorUpgradePro: string; // Màu chính cho nâng cấp lên Pro
  appleClientId: string; // Apple Client ID
}

export class AppInfo implements IAppInfo {
  appId: number;
  appName: string;
  appNameId: string;
  categoryId: string;
  appShortName: string;
  linkAndroid: string;
  linkIos: string;
  bucket: string;
  descriptionSEO: string;
  keywordSEO: string;
  title: string;
  hasState: boolean;
  totalQuestion: number;
  usingFeaturePro: boolean;
  usingMathJax: boolean;
  icon: string;
  stateName?: string;
  link: string;
  stateId?: number;
  ip?: string;
  currentTime?: number;
  rank_math_title: string;
  oneMonthPro?: { planId: string; price: number };
  oneWeekPro?: { planId: string; price: number };
  oneYearPro?: { planId: string; price: number };
  oneTimePro?: { planId: string; price: number };

  constructor(object: Partial<IAppInfo> = {}) {
    this.appId = object.appId ?? -1;
    this.appName = object.appName ?? '';
    this.appNameId = object.appNameId ?? '';
    this.categoryId = object.categoryId ?? '';
    this.appShortName = object.appShortName ?? '';
    this.linkIos = object.linkIos ?? '';
    this.linkAndroid = object.linkAndroid ?? '';
    this.bucket = object.bucket ?? '';
    this.descriptionSEO = object.descriptionSEO ?? '';
    this.keywordSEO = object.keywordSEO ?? '';
    this.title = object.title ?? '';
    this.hasState = parseBoolean(object.hasState);
    this.totalQuestion = object.totalQuestion ?? 0;
    this.usingFeaturePro = parseBoolean(object.usingFeaturePro);
    this.usingMathJax = parseBoolean(object.usingMathJax);
    this.rank_math_title = object.rank_math_title ?? '';
    this.icon = object.icon ?? '';
    this.oneWeekPro = object.oneWeekPro ?? undefined;
    this.oneMonthPro = object.oneMonthPro ?? undefined;
    this.oneYearPro = object.oneYearPro ?? undefined;
    this.link = object.link ?? '';
  }
}
