"use client";
import RouterApp from "@/constants/router.constant";
import { db } from "@/db/db.model";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { setIndexSubTopic, setTurtGame } from "@/redux/features/game";
import {
    selectAttemptNumber,
    selectCurrentTopicId,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { IconSubTopic } from "./iconTopic";
import { AllowExpandContext, IContextAllowExpand } from "./provider";

type IProps = {
    part: ITopicBase;
    index: number;
    isPass: boolean;
    readySubTopic?: ITopicBase;
};

const IconProgress = ({ part, index, isPass, readySubTopic }: IProps) => {
    const listQuestion = useAppSelector(selectListQuestion);
    const turn = useAppSelector(selectAttemptNumber);
    const partId = useAppSelector(selectCurrentTopicId);
    const { mainTopicTag } =
        useContext<IContextAllowExpand>(AllowExpandContext);

    const isCurrentPlaying = readySubTopic?.id === part?.id;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [progress, setProgress] = useState(0);

    const handleClick = useCallback(async () => {
        dispatch(setIndexSubTopic(index));

        if (isPass) {
            router.push(
                `${RouterApp.Finish}?subTopicId=${part.parentId}&topic=${mainTopicTag}-practice-test&partId=${part.id}`,
                {
                    scroll: true,
                }
            );
            return;
        }
        if (isCurrentPlaying || index === 1) {
            dispatch(
                initQuestionThunk({
                    partId: part.id,
                    subTopicId: part.parentId,
                })
            );
            dispatch(
                setTurtGame({
                    turn: 1,
                })
            );
            const _href = `/study/${mainTopicTag}-practice-test?type=learn&partId=${part?.id}&subTopicId=${part.parentId}`;

            router.push(_href);
        }
    }, [part, isPass, dispatch, mainTopicTag, router, index, isCurrentPlaying]);

    useEffect(() => {
        if (!listQuestion.length || part.id !== partId || !turn) return;

        const fetchProgress = async () => {
            const progressData = await db?.userProgress
                .where("parentId")
                .equals(part.id)
                .filter((item) =>
                    item.selectedAnswers.some(
                        (ans) => ans.turn === turn && ans.correct
                    )
                )
                .toArray();

            if (progressData) {
                setProgress(
                    Math.floor(
                        (progressData.length / listQuestion.length) * 100
                    )
                );
            }
        };

        fetchProgress();
    }, [part.id, partId, listQuestion, turn]);
    return (
        <div
            className={clsx(
                "w-14 z-10  flex flex-col  items-center justify-center",
                {
                    "cursor-pointer": isPass || isCurrentPlaying,
                    "cursor-not-allowed": !isCurrentPlaying,
                }
            )}
            key={index}
            onClick={handleClick}
        >
            <IconSubTopic
                lock={!isCurrentPlaying && index !== 1}
                activeAnim={partId === part?.id}
                isFinishThisLevel={isPass}
                currentLevelScore={
                    partId === part?.id ? progress : isPass ? 100 : progress
                }
            />

            <div className="max-w-14 text-center pt-1 text-[10px] text-[#212121] truncate">
                Core {index}
            </div>
        </div>
    );
};

export default IconProgress;
