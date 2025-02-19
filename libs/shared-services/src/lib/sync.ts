import { requestPostData } from "./request";
import { isProduction, BASE_URL_DEV } from "@shared-constants";

const BASE_URL = isProduction ? "" : BASE_URL_DEV;

export function uploadUserStudyPlanAPI(data: Record<string, unknown>) {
    return requestPostData({
        url: "/api/auth?type=update-study-plan",
        data: data,
        config: {
            baseURL: BASE_URL,
        },
    });
}

export const uploadPaymentInfoAPI = (object: Record<string, unknown>) => {
    return requestPostData({
        url: "/api/auth?type=save-payment-info",
        data: object,
        config: {
            baseURL: BASE_URL,
        },
    });
};

export const saveToDashboardAPI = (object: {
    app: string;
    price: number;
    email: string;
}) => {
    return requestPostData({
        url: "pro-purchase-events/",
        data: object,
        config: {
            baseURL: "https://dashboard-api2.abc-elearning.org/",
        },
    });
};
