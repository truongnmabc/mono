"use client";

import { ICurrentGame } from "@/models/game/game";
import { setCurrentQuestion } from "@/redux/features/game";
import {
    selectCurrentGame,
    selectCurrentQuestionIndex,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import clsx from "clsx";
import React from "react";

/**
 * Các thuộc tính (props) cho component.
 *
 * @typedef {Object} IProps
 * @property {boolean} [isActions] - Hiển thị trạng thái câu hỏi làm/chưa làm.
 * @property {boolean} [isCenter] - Căn giữa nội dung.
 * @property {string} [wrapperClassName] - Lớp CSS tùy chỉnh cho wrapper.
 */
type IProps = {
    isActions?: boolean;
    isCenter?: boolean;
    wrapperClassName?: string;
};

const AnswerSheet: React.FC<IProps> = ({
    isActions = false,
    isCenter = false,
    wrapperClassName = "bg-white",
}) => {
    const listQuestion = useAppSelector(selectListQuestion);
    const currentGame = useAppSelector(selectCurrentGame);
    const indexCurrentGame = useAppSelector(selectCurrentQuestionIndex);
    const dispatch = useAppDispatch();

    const getClassNames = (q: ICurrentGame, index: number) =>
        ctx(
            "w-[30px] h-[30px] text-xs rounded transition-all bg-white flex items-center justify-center border border-solid",
            {
                "border-red-500": q.localStatus === "skip",
                "border-[#07C58C] text-white bg-[#07C58C]":
                    q.localStatus === "correct" && !isActions,
                "border-[#FF746D] text-white bg-[#FF746D]":
                    q.localStatus === "incorrect" && !isActions,
                "opacity-90 bg-white": q.localStatus === "new",
                "cursor-pointer": isActions,
                "cursor-not-allowed": !isActions,
                "border-[#5497FF] text-white bg-[#5497FF]":
                    isActions && q.localStatus !== "new",
                "border-[#5497FF] bg-white text-[#5497FF]":
                    isActions && index === indexCurrentGame,
            }
        );

    return (
        <div
            className={ctx(
                "flex flex-col gap-3 dark:bg-black p-4 rounded-md",
                wrapperClassName
            )}
        >
            <h3 className="font-semibold text-center text-xl truncate font-poppins">
                Questions
            </h3>
            <div
                className={clsx("flex gap-2 flex-wrap", {
                    "justify-center": isCenter,
                })}
            >
                {listQuestion?.map((q, index) => (
                    <div
                        key={index}
                        className={getClassNames(q, index)}
                        onClick={() => {
                            if (isActions && currentGame?.id !== q.id)
                                dispatch(setCurrentQuestion(index));
                        }}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(AnswerSheet);
