"use client";

import LazyLoadImage from "@/components/images";
import { useTheme } from "@/hooks/useTheme";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import "./style.css";

const FN = () => {
    const { theme } = useTheme();
    const { appInfo } = useAppSelector(appInfoState);

    const openApp = () => {
        const userAgent = navigator.userAgent;

        if (/iPad|iPhone|iPod/.test(userAgent)) {
            window.location.href = appInfo.linkIos;
        } else if (/android/i.test(userAgent)) {
            window.location.href = appInfo.linkAndroid;
        }
    };

    return (
        <div className="bg-cover sm:hidden bg-[url('/images/download/bg-download.png')]  blur-up bg-[position:0_-124px] transition-all w-full bg-white h-16  bg-no-repeat">
            <div className="px-4 py-2 flex gap-2 items-center w-full h-full bg-[#7B705CCC]">
                <div className="flex-1  ">
                    <LazyLoadImage
                        src={`/images/logo/${
                            theme == "light" ? "logo-light" : "logo-dark"
                        }.png`}
                        alt={"logo-" + appInfo.appShortName}
                        classNames="h-5 w-16"
                    />

                    <div className="flex items-center text-[10px] gap-[2px]">
                        <p className={"highlight-text"} />
                    </div>
                </div>
                <div
                    className="px-3 py-[6px] rounded-full bg-primary text-white "
                    onClick={openApp}
                >
                    Get the App
                </div>
            </div>
        </div>
    );
};

const DownLoadApp = React.memo(FN);
export default DownLoadApp;
