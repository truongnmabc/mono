import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import { db } from "@/db/db.model";
import { startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { fetchQuestionsHardForTopics } from "@/utils/math";
import { useState } from "react";
import ChoiceQuestionBeforeStart from "../random/choiceQuestionBeforeStart";

const HardQuestions = ({ isMobile }: { isMobile: boolean }) => {
    const [isStart, setIsStart] = useState(false);

    const dispatch = useAppDispatch();

    const handleStartTest = async (value: number) => {
        setIsStart(true);

        const topics = await db?.topics.toArray();
        if (topics?.length) {
            const countQuestionTopic = Math.floor(value / topics.length);

            const remainderQuestionTopic = value % topics.length;
            const list = await fetchQuestionsHardForTopics({
                countQuestionTopic,
                remainderQuestionTopic,
                selectListTopic: topics,
                target: value,
            });
            dispatch(
                startRandomReview({
                    listQuestion: list,
                })
            );
        }
    };

    return (
        <div
            className="w-full rounded-lg bg-white "
            style={{
                boxShadow: "0px 2px 4px 0px #2121211F",
            }}
        >
            {isStart && (
                <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                    <div className="sm:p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-center ">
                            <h3 className="text-xl font-semibold ">
                                Hard Questions
                            </h3>
                        </div>
                        <ProgressQuestion />
                        <QuestionContent />
                        <ChoicesPanel />
                        <ExplanationDetail />
                    </div>

                    <BottomActions type="learn" />
                </div>
            )}
            {!isMobile && !isStart && (
                <ChoiceQuestionBeforeStart handleStartTest={handleStartTest} />
            )}
        </div>
    );
};

export default HardQuestions;
