import { setCurrentQuestion } from "@/redux/features/game";
import {
    selectCurrentQuestionIndex,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useMemo, useCallback } from "react";
import { MtUiButton } from "../button";

const BtnMobile = () => {
    const dispatch = useAppDispatch();
    const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
    const listQuestion = useAppSelector(selectListQuestion);

    const listLength = listQuestion.length;

    // Xác định xem có phải câu đầu tiên hoặc câu cuối cùng không
    const isFirstQuestion = useMemo(
        () => indexCurrentQuestion === 0,
        [indexCurrentQuestion]
    );
    const isLastQuestion = useMemo(
        () => indexCurrentQuestion + 1 >= listLength,
        [indexCurrentQuestion, listLength]
    );

    // Xử lý điều hướng giữa các câu hỏi
    const handleNavigate = useCallback(
        (direction: "prev" | "next") => {
            if (direction === "prev" && !isFirstQuestion) {
                dispatch(setCurrentQuestion(indexCurrentQuestion - 1));
            } else if (direction === "next") {
                if (!isLastQuestion) {
                    dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
                } else {
                    dispatch(shouldOpenSubmitTest(true));
                }
            }
        },
        [dispatch, indexCurrentQuestion, isFirstQuestion, isLastQuestion]
    );

    return (
        <div className="w-full flex items-center gap-4 sm:p-4 sm:w-fit">
            <MtUiButton
                animated
                className="py-3 px-8 border-primary bg-white text-primary"
                block
                onClick={() => handleNavigate("prev")}
                disabled={isFirstQuestion}
            >
                Previous
            </MtUiButton>
            <MtUiButton
                animated
                className="py-3 px-8 border-primary text-primary"
                block
                onClick={() => handleNavigate("next")}
                type="primary"
            >
                Next
            </MtUiButton>
        </div>
    );
};

export default React.memo(BtnMobile);
