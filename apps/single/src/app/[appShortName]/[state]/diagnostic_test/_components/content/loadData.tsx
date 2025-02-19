import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";

import { useEffect, memo } from "react";

const LoadDataDiagnosticTest = () => {
    const idTopics = useAppSelector(selectCurrentTopicId);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!idTopics || idTopics === -1) {
            dispatch(initDiagnosticTestQuestionThunk());
        }
    }, [idTopics, dispatch]);

    return null;
};

export default memo(LoadDataDiagnosticTest);
