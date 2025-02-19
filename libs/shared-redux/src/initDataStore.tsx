"use client";
import { IAppInfo } from "@/models/app/appInfo";
import { memo } from "react";
import { IAppConfigData, setAppConfig } from "./features/appConfig";
import { selectAppConfig } from "./features/appConfig.reselect";
import { setAppInfo } from "./features/appInfo";
import { selectAppInfo } from "./features/appInfo.reselect";
import { useAppDispatch, useAppSelector } from "./hooks";

const InitDataStore = ({
    appConfig,
    appInfo,
}: {
    appInfo: IAppInfo;
    appConfig: IAppConfigData;
}) => {
    const dispatch = useAppDispatch();
    const currentAppInfo = useAppSelector(selectAppInfo);
    const currentAppConfig = useAppSelector(selectAppConfig);

    if (appInfo.appId !== currentAppInfo.appId) {
        dispatch(setAppInfo(appInfo));
    }
    if (appConfig.appId !== currentAppConfig.appId) {
        dispatch(setAppConfig(appConfig));
    }
    return null;
};

export default memo(InitDataStore);
