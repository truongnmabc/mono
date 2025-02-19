"use client";

import IconLinkStoreApp from "@/components/iconLinkStoreApp";
import { useIsMobile } from "@/hooks/useIsMobile";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import ImgRightBannerApp from "./imgRight";
const BannerDownloadApp = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const isMobile = useIsMobile();
    return (
        <div className="bg-white hidden sm:flex  justify-between items-center gap-3 flex-col sm:flex-row dark:bg-black rounded-md overflow-hidden">
            <div className="p-4 flex flex-col gap-6 sm:p-6">
                <h4 className="text-sm sm:text-xl  text-center  font-semibold">{`Download our ${appInfo.appName.toUpperCase()} Prep app now to study anywhere, anytime!`}</h4>
                {!isMobile && (
                    <div className="flex items-center justify-center gap-2">
                        <IconLinkStoreApp type="ios" />
                        <IconLinkStoreApp type="android" />
                    </div>
                )}
            </div>
            <ImgRightBannerApp />

            {isMobile && (
                <div className="flex pt-4 flex-col gap-2">
                    <IconLinkStoreApp type="ios" />
                    <IconLinkStoreApp type="android" />
                </div>
            )}
        </div>
    );
};
export default React.memo(BannerDownloadApp);
