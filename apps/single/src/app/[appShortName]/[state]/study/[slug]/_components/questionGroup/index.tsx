"use client";
import React from "react";
import AnswerSheet from "@/components/listLeftQuestions";
import FinalTestBtn from "@/components/finalTestBtn";
import GridTestsLeft from "@/components/gridTests";
import GridTopicLeft from "@/components/gridTopics";
import { useSearchParams } from "next/navigation";
import { IGameMode } from "@/models/tests";

const QuestionGroup = () => {
    const type = useSearchParams()?.get("type") as IGameMode;
    return (
        <div className="hidden sm:block w-full">
            <div className="flex p-3 bg-white rounded-xl flex-col gap-4">
                {type === "practiceTests" && <AnswerSheet />}
                {type === "practiceTests" ? (
                    <>
                        <GridTestsLeft />
                        <div className="w-full h-[1px] bg-[#21212129]"></div>
                        <GridTopicLeft />
                    </>
                ) : (
                    <>
                        <GridTopicLeft />
                        <div className="w-full h-[1px] bg-[#21212129]"></div>
                        <GridTestsLeft />
                    </>
                )}
                <div className="w-full h-[1px] bg-[#21212129]"></div>
                <FinalTestBtn />
            </div>
        </div>
    );
};
export default React.memo(QuestionGroup);
