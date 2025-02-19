"use client";
import MtUiSkeleton from "@/components/loading-skeleton";
import { ICurrentGame } from "@/models/game/game";
import { useAppDispatch } from "@/redux/hooks";
import choiceAnswer from "@/redux/repository/game/choiceAnswer/choiceAnswer";
import BtnTets from "@/tests/btn";
import ctx from "@/utils/mergeClass";
import { MathJax } from "better-react-mathjax";
import React, { useCallback } from "react";
import GetIconPrefix from "../choicesPanel/getIcon";
import { IAnswer } from "@/models/question";
const AnswerButton = ({
    choice,
    index,
    isActions,
    currentGame,
}: {
    choice: IAnswer;
    index: number;
    isActions?: boolean;
    currentGame: ICurrentGame;
}) => {
    const dispatch = useAppDispatch();

    const statusChoice =
        currentGame?.selectedAnswer &&
        ((currentGame?.selectedAnswer?.id === choice?.id && choice?.correct) ||
            choice.correct)
            ? "pass"
            : currentGame?.selectedAnswer?.id === choice?.id && !choice?.correct
            ? "miss"
            : "other";

    const handleClick = useCallback(() => {
        if (
            currentGame?.selectedAnswer === null ||
            !currentGame?.selectedAnswer ||
            isActions
        ) {
            dispatch(
                choiceAnswer({
                    question: currentGame,
                    choice: choice,
                })
            );
        }
    }, [dispatch, isActions, currentGame, choice]);

    return (
        <div
            onClick={handleClick}
            className={ctx(
                "flex gap-2 w-full h-full bg-white sm:bg-transparent cursor-pointer items-center rounded-md border border-solid px-4 py-3 hover:bg-[#2121210a]",
                {
                    "border-[#21212185]":
                        isActions &&
                        currentGame?.selectedAnswer?.id === choice?.id,
                    "border-[#07C58C]": statusChoice === "pass" && !isActions,
                    "border-[#FF746D]": statusChoice === "miss" && !isActions,
                    " pointer-events-none":
                        !isActions && currentGame?.selectedAnswer,
                }
            )}
            id={(index + 1).toString()}
        >
            <GetIconPrefix
                isActions={isActions}
                isSelect={currentGame?.selectedAnswer?.id === choice?.id}
                statusChoice={statusChoice}
            />

            {!choice.text ? (
                <MtUiSkeleton className="min-h-8 h-8 w-full" />
            ) : (
                <MathJax
                    style={{
                        fontSize: 12,
                    }}
                    dynamic
                    renderMode="post"
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: choice.text,
                        }}
                    />
                </MathJax>
            )}
            <BtnTets correct={choice.correct} />
        </div>
    );
};
export default React.memo(AnswerButton);
