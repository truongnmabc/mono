"use client";
import CountTime from "@/components/countTime";
import ClockIcon from "@/components/icon/ClockIcon";
import { TypeParam } from "@/constants";
import RouterApp from "@/constants/router.constant";
import {
    selectCurrentTopicId,
    selectRemainingTime,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishCustomTestThunk from "@/redux/repository/game/finish/finishCustomTest";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
const CountTimeCustomTest = () => {
    const dispatch = useAppDispatch();

    const remainTime = useAppSelector(selectRemainingTime);
    const router = useRouter();
    const idTopics = useAppSelector(selectCurrentTopicId);

    const handleEndTime = useCallback(() => {
        dispatch(finishCustomTestThunk());

        const _href = `${RouterApp.ResultTest}?type=${TypeParam.customTest}&testId=${idTopics}`;
        router.replace(_href);
    }, [dispatch, router, idTopics]);
    if (remainTime > 0) {
        return (
            <div className="w-full flex items-center justify-center">
                <div className="flex items-center justify-center w-fit gap-2">
                    <ClockIcon />
                    <CountTime
                        duration={remainTime}
                        onEndTime={handleEndTime}
                    />
                </div>
            </div>
        );
    }

    return null;
};

export default CountTimeCustomTest;
