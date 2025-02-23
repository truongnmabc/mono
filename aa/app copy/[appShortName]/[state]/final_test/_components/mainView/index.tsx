"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ClockIcon from "@/components/icon/ClockIcon";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import TitleQuestion from "@/components/titleQuestion";
import CountTimeFinalTest from "../countTimeFinal";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import pauseTestThunk from "@/redux/repository/game/pauseAndResumed/pauseTest";

const MainViewFinalTest = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(pauseTestThunk({}));
        };
    }, [dispatch]);
    return (
        <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
            <div className="sm:p-4 flex flex-1 overflow-auto flex-col gap-3">
                <TitleQuestion />
                <ProgressQuestion isActions />
                <div className="w-full flex items-center justify-center">
                    <div className="flex items-center justify-center w-fit gap-2">
                        <ClockIcon />
                        <CountTimeFinalTest />
                    </div>
                </div>
                <QuestionContent showStatus={false} showQuestionsCount />
                <ChoicesPanel isActions />
            </div>

            <BottomActions type="finalTests" />
        </div>
    );
};

export default MainViewFinalTest;
