"use client";
import { MtUiButton } from "@/components/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { startRandomReview } from "@/redux/features/game";
import { selectListQuestion } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Dialog } from "@mui/material";
import { useCallback, useContext, useState } from "react";
// import { genRandomQuestion } from "../content/random";
import ChoiceQuestionBeforeStart from "../content/random/choiceQuestionBeforeStart";
import { ReviewContext } from "../context";

const BottomLestTest = () => {
    const { selectType, isStart, setIsOpenSheet } = useContext(ReviewContext);
    const [open, setOpen] = useState(false);
    const listQuestions = useAppSelector(selectListQuestion);

    const isMobile = useIsMobile();
    const handleOpen = useCallback(() => {
        if (isMobile) {
            setIsOpenSheet(true);
        } else {
            setOpen(true);
        }
    }, [isMobile, setIsOpenSheet]);

    const handleClose = useCallback(() => setOpen(false), []);

    const dispatch = useAppDispatch();

    const handleStartTest = useCallback(
        async (e: number) => {
            // const listQuestionLength = listQuestions.length;

            // const questions = [...listQuestions];
            // if (e > listQuestionLength) {
            //     const remainLength = e - listQuestionLength;

            //     console.log("🚀 ~ remainLength:", remainLength);

            //     const listQuestion = await genRandomQuestion({
            //         value: remainLength,
            //         excludeListID: listQuestions?.map((item) => item.id),
            //     });
            //     questions.push(...listQuestion);
            // }

            const ques = listQuestions?.slice(0, e);
            dispatch(
                startRandomReview({
                    listQuestion: ques,
                })
            );
            handleClose();
        },
        [handleClose, listQuestions, dispatch]
    );
    if (isStart) return null;
    if (selectType === "saved" || selectType === "weak") {
        return (
            <div className=" fixed z-20 bottom-0 left-0 right-0 h-fit">
                <div className="w-full h-full  py-4 bg-[#F9F7EE] flex items-center justify-center">
                    <MtUiButton
                        type="primary"
                        className="text-base px-10"
                        size="large"
                        onClick={handleOpen}
                    >
                        Let&apos;s Review
                    </MtUiButton>
                </div>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    sx={{
                        "& .MuiDialog-paper": {
                            width: "100%",
                            maxWidth: "900px",
                            maxHeight: "240px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            borderRadius: "12px",
                        },
                    }}
                >
                    <p className="text-2xl pt-6 font-semibold text-center">
                        How many questions do you want?
                    </p>
                    <ChoiceQuestionBeforeStart
                        handleStartTest={handleStartTest}
                    />
                </Dialog>
            </div>
        );
    }
    return null;
};

export default BottomLestTest;
