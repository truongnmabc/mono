"use client";

import { initializeDB } from "@/db/db.model";
import { IAppInfo } from "@/models/app/appInfo";
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
