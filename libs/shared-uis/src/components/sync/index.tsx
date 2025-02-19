"use client";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserDeviceLogin } from "@/redux/repository/sync/syncData";
import { useEffect, useState } from "react";

const SyncData = () => {
    const appInfos = useAppSelector(selectAppInfo);
    const userInfo = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();
    const [isMount, setIsMount] = useState(false);

    useEffect(() => {
        if (userInfo && userInfo?.id && appInfos && !isMount) {
            setIsMount(true);
            dispatch(
                getUserDeviceLogin({
                    appInfo: appInfos,
                    email: userInfo?.email,
                })
            );
        }
    }, [userInfo, appInfos, dispatch, isMount]);
    return null;
};

export default SyncData;
