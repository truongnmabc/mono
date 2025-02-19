import { useIsMobile } from "@/hooks/useIsMobile";
import { IGameMode } from "@/models/tests";
import React from "react";
import Keyboard from "../keyboard";
import Reaction from "../reaction";
import WrapperBtnActions from "./btnActions";
import BtnMobile from "./btnMobile";

export type IPropsBottomAction = {
    type: IGameMode | "review";
};

// Bản mobile và test custom, test final, test diagnostic sẽ sử dụng component BtnMobile

const BottomActions: React.FC<IPropsBottomAction> = ({ type = "learn" }) => {
    const isMobile = useIsMobile();

    return (
        <div className="flex fixed sm:static shadow-bottom sm:shadow-none bottom-0 left-0 right-0 z-50 bg-theme-dark sm:px-4 sm:bg-[#7C6F5B0F] flex-col sm:flex-row pb-8 pt-3 sm:py-3 justify-between gap-2 sm:gap-4 items-center">
            <div className="flex gap-2 sm:gap-8 items-center">
                <Keyboard />
                <Reaction />
            </div>

            <div className="px-4 w-full flex items-center gap-2 sm:p-4 sm:w-fit">
                {isMobile && type !== "learn" ? (
                    <BtnMobile />
                ) : (
                    <WrapperBtnActions type={type} />
                )}
            </div>
        </div>
    );
};

export default React.memo(BottomActions);
