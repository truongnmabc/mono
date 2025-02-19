import { MtUiButton } from "@/components/button";
import { db } from "@/db/db.model";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { setIndexSubTopic, setTurtGame } from "@/redux/features/game";
import { selectSubTopics } from "@/redux/features/study";
import { useAppDispatch } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { calculatePassingApp } from "../calculate";

type NavigateToHrefParams = {
    topicName: string;
    nextPart: ITopicBase;
};

const updateTurnTopic = async ({
    partId,
    currentTopicId,
    subTopicId,
}: {
    partId: number;
    currentTopicId: number;
    subTopicId: number;
}) => {
    if (!partId || !currentTopicId || !subTopicId) return;

    try {
        await db?.topics
            .where("id")
            .equals(currentTopicId)
            .modify((topic) => {
                topic.topics = topic.topics.map((subTopic) => {
                    if (subTopic.id === subTopicId) {
                        return {
                            ...subTopic,
                            topics: subTopic.topics.map((part) =>
                                part.id === partId
                                    ? { ...part, turn: (part.turn ?? 0) + 1 }
                                    : part
                            ),
                        };
                    }
                    return subTopic;
                });
            });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật turn của part:", error);
    }
};

const PassingFinishPage = ({
    nextPart,
    currentPart,
    currentTurn,
    extraPoint,
    currentTopicId,
    indexSubTopic,
    isNextSubTopic,
    isNextTopic,
}: {
    currentPart: ITopicBase | null;
    nextPart: ITopicBase | null;
    currentTurn: number;
    extraPoint: number;
    currentTopicId: number;
    indexSubTopic: number;
    isNextSubTopic: boolean;
    isNextTopic: boolean;
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const topicName = useSearchParams()?.get("topic");
    const [passing, setPassing] = useState(0);

    useEffect(() => {
        const handleFn = async () => {
            const passing = await calculatePassingApp();
            console.log("🚀 ~ handleFn ~ passing:", passing);
            setPassing(passing);
        };
        handleFn();
    }, []);

    const navigateToHref = useCallback(
        ({ topicName, nextPart }: NavigateToHrefParams) => {
            dispatch(
                initQuestionThunk({
                    partId: nextPart.id,
                    subTopicId: nextPart.parentId,
                })
            );
            const _href = `study/${topicName}?type=learn&subTopic=${nextPart.parentId}&partId=${nextPart.id}`;
            router.push(_href);
        },
        [dispatch, router]
    );

    const handleNextPart = useCallback(async () => {
        if (nextPart && topicName) {
            dispatch(setIndexSubTopic(indexSubTopic + 1));
            dispatch(
                setTurtGame({
                    turn: 1,
                })
            );
            dispatch(selectSubTopics(nextPart.parentId));
            navigateToHref({
                topicName,
                nextPart: nextPart,
            });

            return;
        }
    }, [nextPart, navigateToHref, dispatch, topicName, indexSubTopic]);

    const handleTryAgainFn = useCallback(async () => {
        if (currentPart?.id) {
            dispatch(
                setTurtGame({
                    turn: currentTurn + 1,
                })
            );
            dispatch(
                initQuestionThunk({
                    partId: currentPart.id,
                    subTopicId: currentPart.parentId,
                    attemptNumber: currentTurn + 1,
                })
            );
            await updateTurnTopic({
                partId: currentPart.id,
                currentTopicId: currentTopicId,
                subTopicId: currentPart.parentId,
            });
            const _href = `study/${topicName}?type=learn&subTopic=${currentPart.parentId}&partId=${currentPart.id}`;
            router.push(_href);
        }
    }, [currentPart, currentTurn, topicName, dispatch, router, currentTopicId]);

    const oldPassing = passing - extraPoint;
    const oldPassingRounded = Math.ceil(oldPassing);
    const passingRounded = Math.round(passing * 10) / 10;
    const extraPointRounded = Math.round(extraPoint * 10) / 10;

    return (
        <div className="flex w-full  flex-col justify-center items-center">
            <div className="w-full rounded-xl bg-[#7C6F5B] gap-6 items-center flex px-4 py-2 ">
                <div className="flex items-center flex-col sm:flex-row justify-start gap-2">
                    <p className="text-xs sm:text-lg max-w-32 sm:max-w-72 text-center font-medium text-white">
                        Passing Probability{" "}
                    </p>
                    <span className="text-2xl text-white">
                        {Number.isInteger(passingRounded)
                            ? passingRounded
                            : passingRounded.toFixed(1)}{" "}
                        %
                    </span>
                </div>

                <div className="bg-white custom-progress rounded-lg h-9  flex-1 relative">
                    <div className="w-full absolute p-2 inset-0 z-10">
                        <progress
                            value={extraPointRounded}
                            max={extraPointRounded}
                            className="rounded-lg"
                            style={{
                                width: `${extraPointRounded}%`,
                            }}
                        ></progress>
                    </div>
                    <div className="w-full absolute p-2  inset-0 z-20">
                        <progress
                            value={oldPassingRounded}
                            max={oldPassingRounded}
                            className=" rounded-lg"
                            style={{
                                width: `${oldPassingRounded}%`,
                                background: "#12E1AF",
                            }}
                        ></progress>
                    </div>

                    <p className="absolute text-[#12E1AF] text-base right-2 top-0 bottom-0 flex items-center z-50">
                        {" "}
                        + {extraPointRounded} %
                    </p>
                </div>
            </div>

            <div className="flex fixed sm:static bottom-0 left-0 z-20 bg-theme-white   sm:bg-transparent pb-8 sm:pb-2 px-4 pt-6 gap-4 max-w-[480px] w-full items-center">
                <MtUiButton
                    className="text-primary bg-white border-primary"
                    block
                    size="large"
                    onClick={handleTryAgainFn}
                >
                    Try Again
                </MtUiButton>
                {!isNextTopic && (
                    <MtUiButton
                        block
                        size="large"
                        onClick={handleNextPart}
                        type="primary"
                    >
                        {isNextSubTopic ? "Next Sub Topic" : "Continue"}
                    </MtUiButton>
                )}
            </div>
        </div>
    );
};

export default React.memo(PassingFinishPage);
