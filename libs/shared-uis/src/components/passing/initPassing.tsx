"use client";

import { db } from "@/db/db.model";
import { selectIsDataFetched } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const InitPassing = () => {
    const isDataFetched = useAppSelector(selectIsDataFetched);

    useEffect(() => {
        const handleInitPassing = async () => {
            const isEx = await db?.passingApp.get(-1);
            if (isEx) return;

            const [topics, questions] = await Promise.all([
                db?.topics.toArray(),
                db?.questions.toArray(),
            ]);

            const totalQuestion =
                topics?.reduce((acc, topic) => {
                    return (
                        acc +
                        topic.topics.reduce((acc, subTopic) => {
                            return (
                                acc +
                                subTopic.topics.reduce((acc, part) => {
                                    return acc + part.totalQuestion;
                                }, 0)
                            );
                        }, 0)
                    );
                }, 0) || 0;

            const totalAve = questions?.reduce(
                (acc, topic) => acc + (topic.level === -1 ? 50 : topic.level),
                0
            );

            const averageLevel = (totalAve || 0) / totalQuestion;

            await db?.passingApp.add({
                id: -1,
                averageLevel,
                totalQuestion,
            });
        };
        if (isDataFetched) handleInitPassing();
    }, [isDataFetched]);
    return null;
};

export default InitPassing;
