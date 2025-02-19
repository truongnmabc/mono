import { isProduction } from "@shared-constants";
import { requestGetData, requestPostData } from "./request";
import { IResSubcription } from "@shared-models";
// *NOTE: can check lai
/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_get
 * lấy thông tin của đơn hàng hiện tại
 */

export const checkPaypalStatusAPI = async (orderId: string) => {
    const data = await requestGetData({
        url:
            "api/auth?type=check-status-subcription&orderId=" +
            orderId +
            (!isProduction ? "&dev=true" : ""),
        config: {
            baseURL: "https://test-dot-micro-enigma-235001.appspot.com",
        },
    });

    return data as IResSubcription;
};

/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#plans_get
 * lấy thông tin của gói (quan tâm đến thời gian hiệu lực của nó)
 */
export const getPlanInfoApi = async (planId: string) => {
    const data = await requestGetData({
        url: "api/auth",
        params: {
            type: "get-plan-info",
            planId: planId,
            dev: isProduction ? undefined : "true",
        },
        config: {
            baseURL: "https://dev-dot-micro-enigma-235001.appspot.com",
        },
    });
    return data;
};
/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_transactions
 * thông tin các lần thanh toán gia hạn ???
 */
export const getTransactionsSubscriptionApi = async (orderId: string) => {
    const data = await requestGetData({
        url: "api/auth",
        params: {
            type: "get-transactions-subscription",
            orderId: orderId,
            dev: isProduction ? undefined : "true",
        },
        config: {
            baseURL: "https://dev-dot-micro-enigma-235001.appspot.com",
        },
    });
    return data;
};

export const cancelSubscriptionAPI = async (orderId: string) => {
    try {
        const data = await requestGetData({
            url: "api/auth",
            params: {
                type: "cancel-subscription",
                orderId: orderId,
                dev: isProduction ? undefined : "true",
            },
            config: {
                baseURL: "https://dev-dot-micro-enigma-235001.appspot.com",
            },
        });
        return data;
    } catch (error) {
        console.log("error", error);
        return;
    }
};

export const sendEmailSubscribeSuccessAPI = async ({
    price,
    appName,
    email,
    name,
    timeExpiration,
    totalQuestion,
    emailSupport,
    learnPageSlug,
}: {
    appName: string;
    price: string;
    email: string;
    timeExpiration: Date;
    totalQuestion: string;
    name: string;
    emailSupport: string;
    learnPageSlug: string;
}) => {
    try {
        const website = window.location.origin;
        const learnPage = website + learnPageSlug;
        const billingPage = website + "/billing";
        const params = {
            learnPage,
            billingPage,
            emailSupport,
            website,
            price,
            email,
            totalQuestion,
            timeExpiration,
            name,
            appName: appName,
        };
        const data = await requestPostData({
            url: "api/auth?type=send-email-success-subscription",
            data: params,
            config: {
                baseURL: "https://dev-dot-micro-enigma-235001.appspot.com/",
            },
        });
        return data;
    } catch (error) {
        console.log("error", error);
        return;
    }
};
