import { IAppInfo } from "@/models/app/appInfo";
import "./styles.scss";

import React from "react";
const TitleHomeApp = ({ appInfo }: { appInfo: IAppInfo }) => {
    return (
        <div className="pt-6 sm:pt-12">
            <h1 className="text-[32px] leading-[40px] sm:text-[48px] sm:leading-[60px] font-normal text-center capitalize    font-vampiro">
                {appInfo?.appName} Practice Test
            </h1>
            <h2 className="text-xl  sm:text-2xl pt-2 font-medium font-poppins text-center">
                Ace The{" "}
                <strong className="font-semibold text-xl  sm:text-2xl ">
                    {appInfo?.appName}
                </strong>{" "}
                On First Try
            </h2>
        </div>
    );
};

export default React.memo(TitleHomeApp);
