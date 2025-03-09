import Empty from "@/components/empty";
import QuestionResult from "@/components/questionReview";
import { db } from "@/db/db.model";
import { IQuestionOpt } from "@/models/question";
import { setListQuestionGames } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import React, { Fragment, useCallback, useContext, useEffect } from "react";
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

            const userProgress = await db?.userProgress
                ?.where("id")
                .anyOf(ids)
                .toArray();

            const questionsWithAnswers = questions.map((question) => {
                const progress = userProgress?.find(
                    (p) => p.id === question.id
                );
                const lastSelectedAnswer =
                    progress?.selectedAnswers?.[
                        progress.selectedAnswers.length - 1
                    ];

                return {
                    ...question,
                    selectedAnswer: lastSelectedAnswer || null,
                };
            });

            setListTopic(questionsWithAnswers);
            dispatch(setListQuestionGames(questionsWithAnswers));
        }
    }, [dispatch]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div>
            {isStart ? (
                <RandomGameContent />
            ) : (
                <div>
                    {listTopic.length ? (
                        <Fragment>
                            {listTopic?.map((item) => (
                                <div key={item.id} className="py-2">
                                    <QuestionResult item={item} />
                                </div>
                            ))}
                        </Fragment>
                    ) : (
                        <Empty />
                    )}
                </div>
            )}
        </div>
    );
};

export default WeakQuestionsMobile;
