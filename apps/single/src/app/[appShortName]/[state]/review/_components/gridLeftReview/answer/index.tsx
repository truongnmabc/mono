import { selectListQuestion } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { useContext } from "react";
import { ReviewContext } from "../../context";

const AnswerReview = ({ isActions = false }) => {
    const listQuestion = useAppSelector(selectListQuestion);
    const { selectType, isStart } = useContext(ReviewContext);
    if (selectType && listQuestion.length > 0 && isStart) {
        return (
            <div className="bg-white flex flex-col gap-3 dark:bg-black p-4 rounded-md">
                <h3 className="font-semibold text-center text-xl truncate font-poppins">
                    Questions
                </h3>
                <div className="flex gap-2 justify-center  flex-wrap ">
                    {listQuestion?.map((q, index) => {
                        return (
                            <div
                                key={index}
                                className={ctx(
                                    "w-[30px] h-[30px]  text-xs rounded transition-all flex items-center justify-center border border-solid",
                                    {
                                        "border-red-500":
                                            q.localStatus === "skip",

                                        "border-[#07C58C] text-white bg-[#07C58C]":
                                            q.localStatus === "correct" &&
                                            !isActions,
                                        "border-[#FF746D] text-white bg-[#FF746D]":
                                            q.localStatus === "incorrect" &&
                                            !isActions,
                                        "opacity-90": q.localStatus === "new",
                                        "cursor-pointer": isActions,
                                        "border-[#5497FF] text-white bg-[#5497FF]":
                                            isActions &&
                                            q.localStatus !== "new",
                                    }
                                )}
                            >
                                {index + 1}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return <div className="w-full py-1"></div>;
};

export default AnswerReview;
