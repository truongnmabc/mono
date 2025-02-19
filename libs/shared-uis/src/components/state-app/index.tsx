import { IAppInfo } from "@/models/app/appInfo";
import React, { Fragment } from "react";
import MyContainer from "../container";
import dynamic from "next/dynamic";

// import DownloadApp from "../home/downloadApp/downloadApp";
import BtnGotoState from "./listState";
const BannerHome = dynamic(
    () => import("@/components/state-app/newHome/banner/index")
);
const HomeSingleApp = ({ appInfo }: { appInfo: IAppInfo }) => (
    <Fragment>
        <div className="w-full  bg-[#e6ded7] bg-[url('/images/state-background.png')] bg-no-repeat bg-center bg-cover   ">
            <MyContainer className="pb-6 sm:pb-12">
                <div className="flex sm:pt-12 pt-6 flex-col items-center justify-center">
                    <h1 className="font-bold capitalize text-center sm:text-[52px] sm:leading-[64px] text-4xl">
                        {appInfo?.appName + " Practice Test"}
                    </h1>
                    <h2 className="text-2xl sm:text-[40px] sm:leading-[60px] text-center font-normal">
                        Ace The{" "}
                        <strong className="v4-font-semi-bold">
                            {appInfo?.appName}
                        </strong>{" "}
                        On First Try
                    </h2>
                </div>
                <BtnGotoState appInfo={appInfo} />
            </MyContainer>
        </div>
        <MyContainer className="pb-6">
            <BannerHome appInfo={appInfo} isHomePage={true} />
        </MyContainer>
    </Fragment>
);

export default HomeSingleApp;
