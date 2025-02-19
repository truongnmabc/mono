"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import TitleQuestion from "@/components/titleQuestion";
import EmotionComponent from "../emotion/emotionComponent";
import TimeTestGetLever from "../timeTest";

import { useIsMobile } from "@/hooks/useIsMobile";

import dynamic from "next/dynamic";
import { Fragment } from "react";
import Explanation from "./explanationDetail";
import LoadDataDiagnosticTest from "./loadData";

const ClockIcon = dynamic(() => import("@/components/icon/ClockIcon"), {
    ssr: false,
});

const CountTimeDiagnostic = dynamic(() => import("../countTimeRemain"), {
    ssr: false,
});

const ContentTestView = () => {
    const isMobile = useIsMobile();

    return (
        <Fragment>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4  flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion />
                    {isMobile && (
                        <div className="flex items-center justify-center w-full gap-2">
                            <ClockIcon />
                            <CountTimeDiagnostic />
                        </div>
                    )}
                    <div
                        className="bg-white flex flex-col rounded-lg p-3"
                        style={{
                            boxShadow: isMobile
                                ? "0px 4px 20px 0px #2121211A"
                                : "none",
                        }}
                    >
                        <TimeTestGetLever />

                        <QuestionContent
                            showStatus={false}
                            showShadow={false}
                        />
                        <EmotionComponent />
                    </div>
                    <ChoicesPanel />
                    <Explanation />
                </div>

                <BottomActions type="diagnosticTest" />
            </div>
            <LoadDataDiagnosticTest />
        </Fragment>
    );
};

export default ContentTestView;
