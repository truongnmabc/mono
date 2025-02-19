import ClockIcon from "@/components/icon/ClockIcon";
import LazyLoadImage from "@/components/images";
import { useAppSelector } from "@/redux/hooks";
import React, { Fragment } from "react";
import CountTimeDiagnostic from "../countTimeRemain";
import Rating from "@mui/material/Rating";

import { styled } from "@mui/material/styles";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
    selectCurrentGame,
    selectCurrentQuestionIndex,
    selectListQuestion,
} from "@/redux/features/game.reselect";

const CustomRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty svg": {
        color: "#21212133", // Màu nền khi không active
    },
    "& .MuiRating-iconFilled": {
        color: theme.palette.primary.main, // Màu primary khi active
    },
    "& .MuiRating-iconHover": {
        color: theme.palette.primary.light, // Màu sáng hơn khi hover
    },
}));

const TimeTestGetLever = () => {
    const currentGame = useAppSelector(selectCurrentGame);
    const index = useAppSelector(selectCurrentQuestionIndex);
    const list = useAppSelector(selectListQuestion);
    const isMobile = useIsMobile();
    return (
        <Fragment>
            <div className="w-full bg-[#F0F4F9] px-3 py-[14px] rounded-lg flex items-center justify-between">
                <div>
                    <div className="flex gap-1 mb-1 sm:hidden text-xs font-normal">
                        Question {index + 1} / {list.length}
                    </div>
                    <div className="flex items-center gap-1">
                        {!isMobile && (
                            <LazyLoadImage
                                classNames="w-6 h-6"
                                src="/images/notebook-dynamic-color.png"
                            />
                        )}

                        <p className=" capitalize line-clamp-1 text-sm font-medium">
                            {currentGame?.tag?.replaceAll("-", " ")}
                        </p>
                    </div>
                </div>
                {!isMobile && (
                    <div className="flex items-center justify-center w-fit gap-2">
                        <ClockIcon />
                        <CountTimeDiagnostic />
                    </div>
                )}

                <div className="px-2 py-1 flex items-center rounded-lg bg-[#FCFCFC]">
                    <p className="text-sm text-[#21212185]  font-medium pr-1">
                        Level
                    </p>

                    <CustomRating
                        name="read-only"
                        value={
                            currentGame?.level === -1
                                ? 2
                                : currentGame?.level < 50
                                ? 1
                                : 3
                        }
                        max={3}
                        readOnly
                        size={isMobile ? "small" : "medium"}
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default React.memo(TimeTestGetLever);
