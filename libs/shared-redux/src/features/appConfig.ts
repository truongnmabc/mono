import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type IAppConfigData = {
    gaId: string; // Google Analytics ID
    tagManagerId: string; // Google Tag Manager ID
    appId: string | null; // App ID, có thể là chuỗi hoặc null
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
};

export interface IAppConfigReducer {
    appConfig: IAppConfigData;
}
const initialState: IAppConfigReducer = {
    appConfig: {
        gaId: "UA-167769768-1",
        tagManagerId: "GTM-NFL5XHT",
        appId: null,
        googleVerifyId: "J65PLlMKrhHcS6Ql3keUP-l6_tzEDu_5RgZxybRrhDE",
        mainColor: "#329678",
        mainColorBold: "#39B08C",
        mainBackgroundColor: "#f8fdff",
        mainBackgroundColorContact: "#f8fdff",
        linearGradientBanner:
            "linear-gradient(90deg, #FFEED5 0%, #FFFCD9 100%)",
        GA4ID: "G-9WFY79Y40M",
        pageId: "110654290809849",
        wpDomain: "https://passemall.com",
        cookie: "#278F61",
        bgColorStartTest: "#e2a650",
        bgColorCloseCookie: "#3E6798",
        mainColorUpgradePro: "#329678",
        appleClientId: "",
    },
};
export const appConfigSlice = createSlice({
    name: "appConfig",
    initialState,
    reducers: {
        setAppConfig: (state, action: PayloadAction<IAppConfigData>) => {
            state.appConfig = { ...action.payload };
        },
    },
});

const { reducer: appConfigReducer, actions } = appConfigSlice;

export const { setAppConfig } = actions;
export const appConfigState = (state: RootState) => state.appConfigReducer;
export default appConfigReducer;
