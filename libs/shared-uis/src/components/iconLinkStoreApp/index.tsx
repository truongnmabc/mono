"use client";
import { useAppSelector } from "@/redux/hooks";
import { trackingEventGa4 } from "@/services/googleEvent";
import ctx from "@/utils/mergeClass";
import React from "react";
import LazyLoadImage from "../images";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";

const IconLinkStoreApp = ({
    type,
    classNames,
}: {
    type: "ios" | "android";
    classNames?: string;
}) => {
    const appInfo = useAppSelector(selectAppInfo);

    return (
        <LazyLoadImage
            src={
                type === "ios"
                    ? "/images/download/download_ios.webp"
                    : "/images/download/download_android.webp"
            }
            classNames={ctx(
                "icon-download-app  h-[20px] sm:w-[180px] cursor-pointer sm:h-[50px]",
                classNames
            )}
            onClick={() => {
                trackingEventGa4({
                    eventName:
                        type === "ios" ? "click_app_store" : "click_gg_store",
                    value: {},
                });
                window.open(
                    type === "ios" ? appInfo.linkIos : appInfo.linkAndroid,
                    "_blank"
                );
            }}
        />
    );
};

export default React.memo(IconLinkStoreApp);
