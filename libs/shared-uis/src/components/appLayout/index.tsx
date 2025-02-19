import FooterApp from "@/components/footer";
import HeaderApp from "@/components/header";
import React from "react";
import { ToastContainer } from "react-toastify";
import AdsSense from "../ads/adsSense";
import SheetApp from "../sheetApp";
import { NavigationEvents } from "./navigationEvents";
import { ProgressBar } from "./progressBar";
import AuthProvider from "./authProvider";
import WrapperScroll from "./wrapperScroll";
import SyncData from "../sync";
import AdsBlockerDetect from "../ads/detectAdsBlocker";
import PopupSubscription from "../checkSubscription";

const FN = ({ children }: { children: React.ReactNode }) => {
    return (
        <WrapperScroll>
            <ProgressBar className="fixed z-50 top-0 h-1 bg-sky-500">
                <NavigationEvents />
            </ProgressBar>
            <HeaderApp />
            <div className="flex-1 flex flex-col bg-theme-white dark:bg-theme-dark  justify-between">
                {children}
                <FooterApp />
            </div>
            <ToastContainer autoClose={2000} />
            <SheetApp />
            <AuthProvider />
            <SyncData />
            <PopupSubscription />
            <AdsSense />
            <AdsBlockerDetect />
        </WrapperScroll>
    );
};

const AppLayout = React.memo(FN);

export default AppLayout;
