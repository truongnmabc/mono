import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { syncDataToWebAfterLoginAPI } from "@/services/user.service";
import { IAppInfo } from "@/models/app/appInfo";

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
    "getUserDeviceLogin",
    async ({ appInfo, email }: IPayload, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { paymentInfo } = state.paymentReducer;
        console.log("🚀 ~ paymentInfo:", paymentInfo);

        try {
            const syncData = (await syncDataToWebAfterLoginAPI({
                email: email,
                appId: appInfo.appId,
                lastUpdate: -1,
            })) as IRes;

            const userDeviceLogin = syncData.UserDeviceLogins;
            const inAppSubscriptions = syncData.InAppSubscriptions; // mua trên mobile

            if (inAppSubscriptions?.length) {
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
            }
            if (userDeviceLogin.length) {
                // let data = handleUserDevicesLogin(
                //     userDeviceLogin,
                //     appInfo,
                //     paymentInfos
                // );
            }

            // return { paymentInfo, paymentInfos, inAppSubs };
        } catch (error) {
            console.log("getUserData ", error);
        }
        return {
            paymentInfo: null,
            inAppSubs: [],
        };
    }
);

/**
 * Hàm này xử lý data UserDevicesLogin lấy từ gg cloud về và lưu vào paymentInfo
 */
// const handleUserDevicesLogin = (
//     userDeviceLogins: IUserDeviceLogin[],
//     appInfo: IAppInfo,
//     paymentInfos: IPaymentInfos[]
// ) => {
//     try {
//         let paymentInfosSave: PaymentInfo[] = [];
//         let paymentInfo: PaymentInfo | null = null;
//         for (const userDeviceLogin of userDeviceLogins) {
//             if (!userDeviceLogin) {
//                 continue;
//             }
//             let paymentInfoExist = paymentInfos.find(
//                 (_paymentInfo) => _paymentInfo.appId == userDeviceLogin.appId
//             );
//             if (!paymentInfoExist) {
//                 // chưa tồn tại trong paymentInfos thì tạo mới
//                 paymentInfoExist = new PaymentInfo({
//                     id: userDeviceLogin.id,
//                     createdDate: userDeviceLogin.createdDate,
//                     amount: userDeviceLogin.amount,
//                     emailAddress: userDeviceLogin.emailAddress,
//                     userId: userDeviceLogin.userId,
//                     appId: userDeviceLogin.appId,
//                     paymentStatus:
//                         userDeviceLogin.inAppPURCHASED == 1
//                             ? Config.PAYMENT_SUCCESS
//                             : Config.PAYMENT_INIT,
//                     appShortName: userDeviceLogin.appShortName,
//                     expiredDate: userDeviceLogin?.expiredDate ?? -1,
//                     PURCHASED:
//                         userDeviceLogin.inAppPURCHASED == 1
//                             ? Config.PURCHASED
//                             : Config.PURCHASE,
//                 });
//             } else {
//                 // tồn tại trong paymentInfos rồi thì update
//                 paymentInfoExist = new PaymentInfo({
//                     ...paymentInfoExist,
//                 });
//                 if (userDeviceLogin.amount > 0) {
//                     paymentInfoExist.amount = userDeviceLogin.amount;
//                 }
//                 if (userDeviceLogin.inAppPURCHASED == 1) {
//                     paymentInfoExist.PURCHASED = userDeviceLogin.inAppPURCHASED;
//                 }
//             }
//             paymentInfoExist.orderId = userDeviceLogin.orderId;
//             paymentInfoExist.type = userDeviceLogin.type ?? 0;
//             paymentInfoExist.orderIds = userDeviceLogin?.orderIds ?? []; // ghi đè trường này, vậy tsao lại rỗng ???
//             paymentInfoExist.expiredDate = userDeviceLogin?.expiredDate ?? -1;

//             if (
//                 userDeviceLogin.buyPro == Config.PURCHASED ||
//                 userDeviceLogin.inAppPURCHASED == Config.PURCHASED
//             ) {
//                 paymentInfoExist.buyPro = Config.PURCHASED;
//                 paymentInfoExist.PURCHASED = Config.PURCHASED;
//             }

//             if (isSubscriptionId(paymentInfoExist.orderId)) {
//                 localStorage.setItem(
//                     "isSubcriptionPro",
//                     Config.PAYMENT_PAY_SUBSCRIPTION
//                 );
//             }
//             if (paymentInfoExist.appId == appInfo.appId) {
//                 paymentInfo = paymentInfoExist;
//             }
//             paymentInfosSave.push(paymentInfoExist);
//         }

//         return { paymentInfos: paymentInfosSave, paymentInfo };
//     } catch (error) {
//         console.log("userDeviceLoginFC error ", error);
//         return { paymentInfos: [], paymentInfo: null };
//     }
// };

// const handleUserDevicesLogin = (
//     userDeviceLogins: IUserDeviceLogin[],
//     appInfo: IAppInfo,
//     paymentInfos: PaymentInfo[]
// ): { paymentInfos: PaymentInfo[]; paymentInfo: PaymentInfo | null } => {
//     try {
//         const paymentInfosSave: PaymentInfo[] = [];
//         let paymentInfo: PaymentInfo | null = null;

//         userDeviceLogins.forEach((userDeviceLogin) => {
//             if (!userDeviceLogin) return;

//             // Check for existing paymentInfo
//             let paymentInfoExist = paymentInfos.find(
//                 (info) => info.appId === userDeviceLogin.appId
//             );

//             if (!paymentInfoExist) {
//                 // Create new PaymentInfo
//                 paymentInfoExist = new PaymentInfo({
//                     id: userDeviceLogin.id,
//                     createdDate: userDeviceLogin.createdDate,
//                     amount: userDeviceLogin.amount,
//                     emailAddress: userDeviceLogin.emailAddress,
//                     userId: userDeviceLogin.userId,
//                     appId: userDeviceLogin.appId,
//                     paymentStatus:
//                         userDeviceLogin.inAppPurchared === 1
//                             ? Config.PAYMENT_SUCCESS
//                             : Config.PAYMENT_INIT,
//                     appShortName: userDeviceLogin.appShortName,
//                     expiredDate: userDeviceLogin.expiredDate ?? -1,
//                     PURCHASED:
//                         userDeviceLogin.inAppPurchared === 1
//                             ? Config.PURCHASED
//                             : Config.PURCHASE,
//                 });
//             } else {
//                 // Update existing PaymentInfo
//                 if (userDeviceLogin.amount > 0) {
//                     paymentInfoExist.amount = userDeviceLogin.amount;
//                 }
//                 // if (userDeviceLogin.inAppPurchared === 1) {
//                 //     paymentInfoExist.PURCHASED = Config.PURCHASED;
//                 // }
//             }

//             // Update additional fields
//             Object.assign(paymentInfoExist, {
//                 orderId: userDeviceLogin.orderId,
//                 type: userDeviceLogin.type ?? 0,
//                 orderIds: userDeviceLogin.orderIds ?? [],
//                 expiredDate: userDeviceLogin.expiredDate ?? -1,
//             });

//             // Handle Pro purchase logic
//             if (
//                 userDeviceLogin.buyPro === Config.PURCHASED ||
//                 userDeviceLogin.inAppPurchared === Config.PURCHASED
//             ) {
//                 paymentInfoExist.buyPro = Config.PURCHASED;
//                 // paymentInfoExist.PURCHASED = Config.PURCHASED;
//             }

//             // Subscription check
//             if (isSubscriptionId(paymentInfoExist.orderId)) {
//                 localStorage.setItem(
//                     "isSubcriptionPro",
//                     Config.PAYMENT_PAY_SUBSCRIPTION
//                 );
//             }

//             // Save current app's paymentInfo
//             if (paymentInfoExist.appId === appInfo.appId) {
//                 paymentInfo = paymentInfoExist;
//             }

//             paymentInfosSave.push(paymentInfoExist);
//         });

//         return { paymentInfos: paymentInfosSave, paymentInfo };
//     } catch (error) {
//         console.error("handleUserDevicesLogin error:", error);
//         return { paymentInfos: [], paymentInfo: null };
//     }
// };

export { getUserDeviceLogin };
