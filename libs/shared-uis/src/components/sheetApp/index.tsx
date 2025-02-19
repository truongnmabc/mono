"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/hooks/useTheme";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import LazyLoadImage from "../images";
import dynamic from "next/dynamic";
const Sheet = dynamic(() => import("@/components/sheet"), {
    ssr: false,
});
const SheetApp = () => {
    const [sheetVisible, setSheetVisible] = useState(false);
    const appInfo = useAppSelector(selectAppInfo);
    const isMobile = useIsMobile();

    useEffect(() => {
        const isFistShowBanner = localStorage.getItem("bottom_sheet");
        if (!isFistShowBanner && isMobile) {
            setSheetVisible(true);
        }
    }, [isMobile]);
    const openApp = () => {
        const userAgent = navigator.userAgent;
        console.log("app link", appInfo.linkIos);
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            window.location.href = appInfo.linkIos;
        } else if (/android/i.test(userAgent)) {
            window.location.href = appInfo.linkAndroid;
        }
        localStorage.setItem("bottom_sheet", "true");
    };

    const { theme } = useTheme();

    if (isMobile) {
        return (
            <Sheet
                visible={sheetVisible}
                onClose={() => {
                    setSheetVisible(false);
                    localStorage.setItem("bottom_sheet", "true");
                }}
                mask
                handler
                autoHeight
                height={300}
                swipeToClose
            >
                <div className="w-full h-full text-center flex-1 gap-3 px-6 pb-4 justify-between flex flex-col">
                    <div className="w-full pt-2  flex justify-center items-center">
                        <LazyLoadImage
                            alt={"logo-" + appInfo.appShortName}
                            src={`/images/logo/${
                                theme == "dark" ? "logo-dark" : "logo-light"
                            }.png`}
                            classNames="flex justify-center h-6 items-center"
                        />
                    </div>
                    <div className="font-semibold text-base text-[#212121]">
                        Download our app now for a better test prep experience.
                    </div>
                    <div
                        style={{
                            color: "#21212185",
                        }}
                        className=" underline text-sm "
                        onClick={() => {
                            setSheetVisible(false);
                            localStorage.setItem("bottom_sheet", "true");
                        }}
                    >
                        Continue using mobile site
                    </div>
                    <Button
                        fullWidth
                        sx={{
                            backgroundColor: "var(--text-color-primary)",
                            color: "white",
                            textTransform: "capitalize",
                            borderRadius: "12px",
                            fontSize: "16px",
                            lineHeight: "24px",
                            fontWeight: "600",
                            padding: "12px",
                            ":active": {
                                backgroundColor: "var(--text-color-primary)",
                            },
                            ":focus": {
                                backgroundColor: "var(--text-color-primary)",
                            },
                            ":hover": {
                                backgroundColor: "var(--text-color-primary)",
                            },
                        }}
                        onClick={openApp}
                    >
                        Get the App
                    </Button>
                </div>
            </Sheet>
        );
    }

    return null;
};

export default React.memo(SheetApp);
