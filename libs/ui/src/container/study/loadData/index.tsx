import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initLearnQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import initPracticeThunk from "@/redux/repository/game/initData/initPracticeTest";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoadDataStudy = () => {
    const dispatch = useAppDispatch();
    const id = useAppSelector(selectCurrentTopicId);
    const type = useSearchParams()?.get("type");
    const testId = useSearchParams()?.get("testId");
    const partId = useSearchParams()?.get("partId");
    const subTopicId = useSearchParams()?.get("subTopicId");
    useEffect(() => {
        if (partId && type === "learn" && (!id || id === -1)) {
            dispatch(
                initLearnQuestionThunk({
                    partId: Number(partId),
                    subTopicId: Number(subTopicId),
                })
            );
        }

        if ((!id || id === -1) && type === "practiceTests" && testId) {
            dispatch(initPracticeThunk({ testId: Number(testId) }));
        }
    }, [id, dispatch, type, subTopicId, testId, partId]);
    return null;
};

export default LoadDataStudy;
