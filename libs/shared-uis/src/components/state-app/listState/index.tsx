"use client";

import { IAppInfo } from "@/models/app/appInfo";
// import { revertPathName } from "@/utils/pathName";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ListState from "./listState";

const BtnGotoState = ({ appInfo }: { appInfo: IAppInfo }) => {
    const [currentState, setCurrentState] = useState("");
    const [openListState, setOpenListState] = useState(false);

    useEffect(() => {
        if (appInfo.appNameId) {
            const _state = localStorage.getItem(
                "select-state-" + appInfo.appNameId
            );

            if (_state) {
                setCurrentState(_state);
            }
        }
    }, [appInfo.appNameId]);

    // const router = useRouter();

    return (
        <div className="w-full sm:pt-12 pt-6 flex justify-center flex-col items-center">
            <div
                className="bg-[#212121f5] py-3 px-8 font-semibold text-2xl text-white capitalize text-center rounded-md cursor-pointer "
                onClick={() => {
                    if (currentState) {
                        // *NOTE : bo commet sau
                        // const _href = revertPathName({
                        //     state: currentState,
                        //     appName: appInfo.appShortName,
                        // });
                        // router.push(_href);
                    } else {
                        setOpenListState(true);
                    }
                }}
            >
                {currentState
                    ? `Go To ${currentState?.replaceAll("-", " ")}`
                    : "Get Started"}
            </div>

            {!!currentState && !openListState && (
                <div
                    className="text-center cursor-pointer font-normal text-sm mt-6 "
                    onClick={() => {
                        setOpenListState(true);
                    }}
                >
                    Not your state?
                </div>
            )}
            <ListState
                appInfo={appInfo}
                openListState={openListState}
                setOpenListState={setOpenListState}
            />
        </div>
    );
};

export default React.memo(BtnGotoState);
