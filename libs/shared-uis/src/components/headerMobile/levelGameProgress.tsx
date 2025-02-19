"use client";

import { selectListQuestion } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import React from "react";
type IProps = {
    isActions?: boolean;
};
const LevelGameProgress: React.FC<IProps> = ({ isActions = false }) => {
    const listQuestion = useAppSelector(selectListQuestion);
    const sortedListQuestion = [...listQuestion].sort((a, b) => {
        if (a.localStatus === "correct" && b.localStatus !== "correct")
            return -1;
        if (a.localStatus !== "correct" && b.localStatus === "correct")
            return 1;
        if (a.localStatus === "incorrect" && b.localStatus !== "incorrect")
            return -1;
        if (a.localStatus !== "incorrect" && b.localStatus === "incorrect")
            return 1;
        return 0;
    });

    return (
        <div className="flex bg-[#21212133] w-full h-1">
            {sortedListQuestion.map((q, index) => (
                <div
                    key={index}
                    className={ctx("h-full w-full", {
                        "border-[#07C58C] text-white bg-[#07C58C]":
                            q.localStatus === "correct" && !isActions,
                        "border-[#FF746D] text-white bg-[#FF746D]":
                            q.localStatus === "incorrect" && !isActions,
                        "opacity-90": q.localStatus === "new",
                        "border-[#5497FF] text-white bg-[#5497FF]":
                            isActions && q.localStatus !== "new",
                    })}
                ></div>
            ))}
        </div>
    );
};
export default React.memo(LevelGameProgress);
