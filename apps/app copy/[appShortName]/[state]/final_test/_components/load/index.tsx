import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import { useEffect } from "react";

const LoadDataFinalTest = () => {
    const idTopics = useAppSelector(selectCurrentTopicId);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!idTopics || idTopics === -1) {
            dispatch(initFinalTestThunk());
        }
    }, [idTopics, dispatch]);

    return null;
};

export default LoadDataFinalTest;
