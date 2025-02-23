"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import {
    selectCurrentSubTopicIndex,
    selectGameDifficultyLevel,
} from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import CountTimeCustomTest from "../countTimeCustomTest";

const ContentCustomTest = () => {
    const feedBack = useAppSelector(selectGameDifficultyLevel);
    const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);

    return (
        <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
            <div className="sm:p-4 flex flex-col gap-3">
                <div className="w-full hidden sm:block text-center capitalize text-xl font-semibold">
                    Custom Test {indexSubTopic}
                </div>
                <ProgressQuestion isActions={feedBack === "exam"} />
                <CountTimeCustomTest />
                <QuestionContent showStatus={feedBack === "newbie"} />
                <ChoicesPanel isActions={feedBack === "exam"} />
                {feedBack === "newbie" && <ExplanationDetail unLock />}
            </div>

            <BottomActions type="customTets" />
        </div>
    );
};

export default React.memo(ContentCustomTest);
