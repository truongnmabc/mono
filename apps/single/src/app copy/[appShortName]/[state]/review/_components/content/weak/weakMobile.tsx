import VariableSizeList from "@/components/infinite";
import QuestionResult from "@/components/questionReview";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IQuestionOpt } from "@/models/question";
import { setListQuestionGames } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import clsx from "clsx";
import React, { useCallback, useContext, useEffect } from "react";
import { ReviewContext } from "../../context";
import RandomGameContent from "../random/randomGameContent";

const WeakQuestionsMobile = () => {
    const [listTopic, setListTopic] = React.useState<IQuestionOpt[]>([]);
    const { isStart } = useContext(ReviewContext);

    const dispatch = useAppDispatch();
    const handleGetData = useCallback(async () => {
        const progress = await db?.userProgress.toArray();

        if (progress?.length) {
            const incorrect = progress.filter((item) => {
                const lastThreeAnswers = item.selectedAnswers?.slice(-3) || [];

                const totalAnswers = lastThreeAnswers.length;
                const incorrectAnswers = lastThreeAnswers.filter(
                    (answer) => !answer.correct
                ).length;

                const incorrectPercentage =
                    (incorrectAnswers / totalAnswers) * 100;

                return incorrectPercentage >= 50;
            });

            const ids = incorrect.map((item) => item.id);

            const questions =
                (await db?.questions.where("id").anyOf(ids).toArray()) || [];

            setListTopic(questions);
            dispatch(setListQuestionGames(questions));
        }
    }, [dispatch]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);
    const isMobile = useIsMobile();

    const getItemSize = (index: number) =>
        listTopic[index]?.image ? (isMobile ? 460 : 400) : isMobile ? 420 : 330;

    return (
        <div
            className={clsx({
                "min-h-[400px]": listTopic.length <= 1 && !isStart,
                "min-h-[820px]": listTopic.length > 1 && !isStart,
            })}
        >
            {isStart ? (
                <RandomGameContent />
            ) : (
                <VariableSizeList
                    data={listTopic}
                    getItemSize={getItemSize}
                    item={(item) => (
                        <QuestionResult
                            item={{
                                ...item,
                                parentId: -1,
                            }}
                        />
                    )}
                />
            )}
        </div>
    );
};

export default WeakQuestionsMobile;
