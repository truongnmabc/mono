"use client";
import { selectListQuestion } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import React, { useContext } from "react";
import { ReviewContext } from "../../context";

const TitleReview = () => {
    const { selectType, isStart } = useContext(ReviewContext);
    const list = useAppSelector(selectListQuestion);
    const titles: Record<string, string> = {
        random: "How many questions do you want?",
        hard: "How many questions do you want?",
        weak: "Weak Questions",
        saved: "Saved Questions",
        all: "All Answered Questions",
    };

    const shouldShowTitle =
        (selectType === "random" || selectType === "hard") && list.length === 0
            ? true
            : !isStart && ["weak", "saved", "all"].includes(selectType);

    if (shouldShowTitle)
        return (
            <h2 className="text-2xl text-center font-semibold">
                {titles[selectType]}
            </h2>
        );
    return null;
};

export default React.memo(TitleReview);
