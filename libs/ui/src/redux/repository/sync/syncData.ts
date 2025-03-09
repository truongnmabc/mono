import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IAppInfo } from '@ui/models/app';
import { syncDataToWebAfterLoginAPI } from '@ui/services/sync';

/** lấy dữ liệu payment (web), inAppSubscription (mobile) và update vào redux, gọi mỗi khi vào trang */

type IPayload = {
  appInfo: IAppInfo;
  email: string;
};

type IRes = {
  StudyPlans: [];
  UserDeviceLogins: IUserDeviceLogin[];
  InAppSubscriptions: [];
  DailyGoal: [];
};

interface IUserDeviceLogin {
  id: number;
  appVersion: string;
  userId: string;
  appId: number;
  deviceId: string;
  osVersion: string;
  appShortName: string;
  notificationTime: number;
  notificationEnabled: number;
  themeMode: number;
  currentState: number;
  currentApp: string;
  eventCountKey: number;
  ratedTimestamp: number;
  declinedTimestamp: number;
  inAppPurchared: number;
  inAppPurcharedName: string;
  inAppPurcharedTime: number;
  paymentId: string;
  orderId: string;
  amount: number;
  emailAddress: string;
  paymentSource: string;
  expiredDate: number;
  lastUpdate: number;
  status: number;
  progressData: string;
  buyBasic: number;
  buyPro: number;
  buyFullTest: number;
  buyCustomTest: number;
  buyPrintTopic: number;
  buyPrintTest: number;
  buyStudyGuide: number;
  type: number;
  orderIds: string[];
  appName: string;
  createdDate: string;
}

const getUserDeviceLogin = createAsyncThunk(
  'getUserDeviceLogin',
  async ({ appInfo, email }: IPayload, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { paymentInfo } = state.payment;
    console.log('🚀 ~ paymentInfo:', paymentInfo);

    try {
      // const syncData = (await syncDataToWebAfterLoginAPI({
      //   email: email,
      //   appId: appInfo.appId,
      //   lastUpdate: -1,
      // })) as IRes;
      // const userDeviceLogin = syncData.UserDeviceLogins;
      // const inAppSubscriptions = syncData.InAppSubscriptions; // mua trên mobile
      // if (inAppSubscriptions?.length) {
      // let inAppSubs = inAppSubscriptions.map((app) => {
      //     let result = JSON.parse(app?.result ?? "");
      //     let in_app = [];
      //     result.receipt.in_app.forEach((item) => {
      //         in_app.push({
      //             purchase_date: nd(item.purchase_date_ms),
      //             expires_date: nd(item.expires_date_ms),
      //             in_app_ownership_type: item.in_app_ownership_type,
      //             is_trial_period: item.is_trial_period,
      //         });
      //     });
      //     result.latest_receipt_info?.forEach((item) => {
      //         in_app.push({
      //             purchase_date: nd(item.purchase_date_ms),
      //             expires_date: nd(item.expires_date_ms),
      //             in_app_ownership_type: item.in_app_ownership_type,
      //             is_trial_period: item.is_trial_period,
      //         });
      //     });
      //     return {
      //         id: app.id,
      //         appId: app.appId,
      //         userId: app.userId,
      //         os: app.os,
      //         transactionId: app.transactionId,
      //         createDate: app.createDate,
      //         purchaseDate: app.purchaseDate,
      //         expriredDate: app.expriredDate,
      //         purchased: app.purchased,
      //         trialPeriod: app.trialPeriod,
      //         in_app,
      //     };
      // });
      // }
      // if (userDeviceLogin.length) {
      // let data = handleUserDevicesLogin(
      //     userDeviceLogin,
      //     appInfo,
      //     paymentInfos
      // );
      // }
      // return { paymentInfo, paymentInfos, inAppSubs };
    } catch (error) {
      console.log('getUserData ', error);
    }
    return {
      paymentInfo: null,
      inAppSubs: [],
    };
  }
);

export { getUserDeviceLogin };
