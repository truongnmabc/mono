"use client";
import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoadData = () => {
    const idTopics = useAppSelector(selectCurrentTopicId);
    const dispatch = useAppDispatch();

    const testId = useSearchParams().get("testId");
    useEffect(() => {
        if ((!idTopics || idTopics === -1) && testId) {
            dispatch(initCustomTestThunk({ testId: Number(testId) }));
        }
    }, [idTopics, dispatch, testId]);
    return null;
};

export default LoadData;
