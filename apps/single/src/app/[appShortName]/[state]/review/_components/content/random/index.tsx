"use client";

import { db } from "@/db/db.model";
import { setCurrentTopicId, startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import React, { useCallback } from "react";
import ChoiceQuestionBeforeStart from "./choiceQuestionBeforeStart";
import {
    fetchQuestionsForTopics,
    generateRandomNegativeId,
} from "@/utils/math";

/* 
    value: số câu cần lấy ra
    excludeListID: list ID
*/

export const genRandomQuestion = async ({
    value,
    excludeListID,
}: {
    value: number;
    excludeListID?: number[];
}) => {
    const topics = await db?.topics.toArray();
    if (topics?.length) {
        const countQuestionTopic = Math.floor(value / topics.length);
        const remainderQuestionTopic = value % topics.length;

        const listQuestion = await fetchQuestionsForTopics({
            selectListTopic: topics,
            countQuestionTopic,
            remainderQuestionTopic,
            excludeListID,
            target: value,
        });
        return listQuestion;
    }

    return [];
};

const RandomQuestions = ({ isMobile }: { isMobile: boolean }) => {
    const dispatch = useAppDispatch();

    const handleStartTest = useCallback(
        async (value: number) => {
            const list = await genRandomQuestion({
                value: value,
            });

            const id = generateRandomNegativeId();
            console.log("🚀 ~ id:", id);

            dispatch(
                startRandomReview({
                    listQuestion: list,
                })
            );
            dispatch(setCurrentTopicId(id));
        },
        [dispatch]
    );

    if (isMobile) return null;

    return (
        <div
            className="w-full rounded-lg bg-white "
            style={{
                boxShadow: "0px 2px 4px 0px #2121211F",
            }}
        >
            <ChoiceQuestionBeforeStart handleStartTest={handleStartTest} />
        </div>
    );
};

export default React.memo(RandomQuestions);
