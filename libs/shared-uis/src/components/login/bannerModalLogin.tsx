"use client";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import Blur from "./blur";

const FN = () => {
    const { appInfo } = useAppSelector(appInfoState);

    return (
        <div className="w-full pt-12 sm:pt-0  sm:w-2/3 z-10 relative h-1/2 sm:h-full  flex items-center justify-center ">
            <div className="flex flex-col z-10 gap-6">
                <p className="text-3xl font-poppins text-center px-4  max-w-[440px]">
                    Pass on Your First Attempt With{" "}
                    <span className="text-[#7c6f5b]">
                        {appInfo.appName} Prep!
                    </span>
                </p>
                <div className="w-full flex justify-center">
                    <ul className="list-disc ">
                        <li className="text-xl mt-1 text-[#21212185]">
                            Synchronize among All devices
                        </li>
                        <li className="text-xl mt-1 text-[#21212185]">
                            {appInfo.totalQuestion -
                                (appInfo.totalQuestion % 10)}
                            + free {appInfo.appName} Questions
                        </li>
                        <li className="text-xl mt-1 text-[#21212185]">
                            Smart & Fun Learning Technique
                        </li>
                        <li className="text-xl mt-1 text-[#21212185]">
                            98% Pass on the First Attempt
                        </li>
                    </ul>
                </div>
            </div>

            <div className=" hidden sm:flex absolute pr-2  bottom-0 right-0  z-0">
                <Blur />
            </div>
        </div>
    );
};
const BannerModalLogin = React.memo(FN);
export default BannerModalLogin;
