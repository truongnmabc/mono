"use client";

import { MtUiButton } from "@/components/button";
import RouterApp from "@/constants/router.constant";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const FinalTestBtn = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(selectUserInfo);
    const router = useRouter();

    const handleClick = useCallback(async () => {
        if (!userInfo.isPro) {
            const _href = `${RouterApp.Get_pro}`;
            router.push(_href);
            return;
        }
        dispatch(initFinalTestThunk());
        router.push(RouterApp.Final_test);
    }, [router, dispatch, userInfo]);

    return (
        <MtUiButton block type="primary" onClick={handleClick}>
            <p className="text-base capitalize font-semibold text-white">
                <span className="text-base  font-semibold text-white uppercase">
                    {appInfo.appShortName}
                </span>{" "}
                Final Test
            </p>
        </MtUiButton>
    );
};
export default React.memo(FinalTestBtn);
