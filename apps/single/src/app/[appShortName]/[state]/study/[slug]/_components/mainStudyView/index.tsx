"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useEffect } from "react";
import LoadDataStudy from "../loadData";

import { IGameMode } from "@/models/tests";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/redux/hooks";
import pauseTestThunk from "@/redux/repository/game/pauseAndResumed/pauseTest";

const TitleQuestion = dynamic(() => import("@/components/titleQuestion"), {
    ssr: false,
});

const CountTimeRemainPracticeTest = dynamic(() => import("./countTimeTest"), {
    ssr: false,
});

const ClockIcon = dynamic(() => import("@/components/icon/ClockIcon"), {
    ssr: false,
});

const MainStudyView = () => {
    const type = useSearchParams()?.get("type") as IGameMode;
    const testId = useSearchParams()?.get("testId") as IGameMode;
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(pauseTestThunk({ testId: Number(testId) }));
        };
    }, [dispatch, testId]);
    return (
        <Fragment>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    {type && <TitleQuestion type={type} />}
                    <ProgressQuestion />
                    {type === "practiceTests" && (
                        <div className="w-full flex items-center justify-center">
                            <div className="flex items-center justify-center w-fit gap-2">
                                <ClockIcon />
                                <CountTimeRemainPracticeTest />
                            </div>
                        </div>
                    )}
                    <QuestionContent showStatus={type === "learn"} />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>

                <BottomActions type={type} />
            </div>
            <LoadDataStudy />
        </Fragment>
    );
};
export default React.memo(MainStudyView);
