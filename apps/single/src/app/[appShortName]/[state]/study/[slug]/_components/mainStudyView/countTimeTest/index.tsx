import CountTime from "@/components/countTime";
import { shouldEndTimeTest } from "@/redux/features/game";
import {
    selectCurrentTopicId,
    selectIsGamePaused,
    selectRemainingTime,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import RouterApp from "@/constants/router.constant";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { TypeParam } from "@/constants";

const CountTimeRemainPracticeTest = () => {
    const dispatch = useAppDispatch();

    const remainTime = useAppSelector(selectRemainingTime);
    const idTopics = useAppSelector(selectCurrentTopicId);
    const router = useRouter();
    const isPause = useAppSelector(selectIsGamePaused);
    const handleEndTime = useCallback(() => {
        dispatch(finishPracticeThunk());
        dispatch(shouldEndTimeTest(true));

        const _href = `${RouterApp.ResultTest}?type=${TypeParam.practiceTest}&testId=${idTopics}`;
        router.replace(_href);
    }, [dispatch, router, idTopics]);

    return (
        <CountTime
            duration={remainTime}
            isPause={isPause}
            onEndTime={handleEndTime}
        />
    );
};

export default React.memo(CountTimeRemainPracticeTest);
