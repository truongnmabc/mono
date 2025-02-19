import CountTime from "@/components/countTime";
import {
    selectCurrentTopicId,
    selectIsGamePaused,
    selectRemainingTime,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishFinalThunk from "@/redux/repository/game/finish/finishFinal";
import RouterApp from "@/constants/router.constant";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { TypeParam } from "@/constants";

const CountTimeFinalTest = () => {
    const dispatch = useAppDispatch();

    const remainTime = useAppSelector(selectRemainingTime);
    const isPause = useAppSelector(selectIsGamePaused);
    const router = useRouter();
    const idTopics = useAppSelector(selectCurrentTopicId);

    const handleEndTime = useCallback(() => {
        dispatch(finishFinalThunk());
        const _href = `${RouterApp.ResultTest}?type=${TypeParam.finalTest}&testId=${idTopics}`;
        router.replace(_href);
    }, [dispatch, router, idTopics]);

    return (
        <CountTime
            isPause={isPause}
            duration={remainTime}
            onEndTime={handleEndTime}
        />
    );
};

export default CountTimeFinalTest;
