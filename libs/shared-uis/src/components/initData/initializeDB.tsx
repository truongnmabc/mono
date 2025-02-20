"use client";

import { initializeDB } from "@shared-db";
import { IAppInfo } from "@shared-models/app";
import { useLayoutEffect } from "react";

const InitializeDB = ({ appInfo }: { appInfo: IAppInfo }) => {
    useLayoutEffect(() => {
        if (appInfo) {
            initializeDB(appInfo.appShortName);
        }
    }, [appInfo]);

    return null;
};

export default InitializeDB;
