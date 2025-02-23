"use client";
import React from "react";
import GridLeftCustomTest from "../gridLeft";
import { useIsMobile } from "@/hooks/useIsMobile";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import { selectGameDifficultyLevel } from "@/redux/features/game.reselect";
const AnswerSheet = dynamic(() => import("@/components/listLeftQuestions"), {
    ssr: false,
});

const LeftLayout = () => {
    return (
        <div className="  h-full flex-col gap-4 flex w-full">
            <RenderAnswer />
            <GridLeftCustomTest />
        </div>
    );
};

export default LeftLayout;

const RenderAnswer = () => {
    const isMobile = useIsMobile();

    const feedBack = useAppSelector(selectGameDifficultyLevel);

    if (!isMobile) return <AnswerSheet isActions={feedBack === "exam"} />;
    return null;
};
