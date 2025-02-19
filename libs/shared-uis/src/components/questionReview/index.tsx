"use client";

import { baseImageUrl } from "@/constants";
import LazyLoadImage from "@/components/images";
import Reaction from "@/components/reaction";
import GetIconPrefix from "@/components/choicesPanel/getIcon";
import { ICurrentGame } from "@/models/game/game";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { MyCrypto } from "@/utils/myCrypto";
import { MathJax } from "better-react-mathjax";
import React, { useCallback } from "react";
import { DialogDetailQuestionReview } from "./dialogDetailQuestionReview";
import { selectUserInfo } from "@/redux/features/user.reselect";
import clsx from "clsx";
import { CancelRounded, CheckCircleRounded } from "@mui/icons-material";
const QuestionResult = ({
    item,
    type = "default",
}: {
    item: ICurrentGame;
    type?: "default" | "custom";
}) => {
    if (type === "custom") {
        return (
            <div className="p-1 w-full h-full">
                <div
                    className="rounded-lg bg-white  w-full h-full flex flex-col  flex-1"
                    style={{
                        boxShadow: " 0px 2px 8px 0px #21212129",
                    }}
                >
                    <div className="w-full rounded-t-lg bg-[#FFFBE1] overflow-hidden flex items-center justify-between px-3 py-2 sm:p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 flex items-center justify-center rounded-md">
                                <LazyLoadImage
                                    classNames="w-6 h-6"
                                    src={item?.icon || ""}
                                />
                            </div>

                            <p className="text-base flex-1  font-medium capitalize ">
                                {item?.tag?.replaceAll("-", " ")}
                            </p>
                        </div>
                    </div>
                    <div className="flex px-4 pt-4 items-center justify-between">
                        <div className="flex items-center gap-1">
                            {item.selectedAnswer?.correct ? (
                                <>
                                    <CheckCircleRounded htmlColor="#00c17c" />
                                    <div className="text-[#00c17c]">
                                        CORRECT
                                    </div>
                                </>
                            ) : (
                                <>
                                    <CancelRounded htmlColor="#fb7072" />
                                    <div className="text-[#FF746D]">
                                        INCORRECT
                                    </div>
                                </>
                            )}
                        </div>
                        <Reaction item={item} />
                    </div>
                    <ContentAnswer item={item} />
                </div>
            </div>
        );
    }
    return (
        <div
            className="rounded-lg  w-full h-full flex flex-col flex-1"
            style={{
                boxShadow: " 0px 2px 8px 0px #21212129",
            }}
        >
            <div className="w-full  rounded-t-lg bg-[#FFFBE1] overflow-hidden flex items-center justify-between px-3 py-2 sm:p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 flex items-center justify-center rounded-md">
                        <LazyLoadImage
                            classNames="w-6 h-6"
                            src={item?.icon || ""}
                        />
                    </div>

                    <p className="text-base flex-1  font-medium capitalize ">
                        {item?.tag?.replaceAll("-", " ")}
                    </p>
                </div>
                <Reaction item={item} />
            </div>
            <ContentAnswer item={item} />
        </div>
    );
};

const ContentAnswer = ({ item }: { item: ICurrentGame }) => {
    const appInfo = useAppSelector(selectAppInfo);
    const [open, setOpen] = React.useState(false);
    const userInfos = useAppSelector(selectUserInfo);
    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClickClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <div className="rounded-b-lg  bg-white flex flex-1 overflow-hidden  flex-col gap-2 p-4">
            <div className="w-full flex justify-between gap-2 ">
                {item?.text && (
                    <MathJax dynamic>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: MyCrypto.decrypt(item?.text) || "",
                            }}
                            className="text-sm font-normal line-clamp-1 sm:text-base"
                        />
                    </MathJax>
                )}
                {item?.image && (
                    <LazyLoadImage
                        key={item.image}
                        isPreview
                        src={`${baseImageUrl}${appInfo.appShortName}/images/${item.image}`}
                        alt={item.image}
                        classNames="w-16 sm:w-24 cursor-pointer aspect-video min-h-16 max-h-24"
                    />
                )}
            </div>
            <div className={"grid gap-2 grid-cols-1 sm:grid-cols-2"}>
                {item?.answers?.map((choice, index) => (
                    <div
                        className={ctx(
                            "flex gap-2 w-full h-full bg-white sm:bg-transparent items-center rounded-md border border-solid px-4 py-3 hover:bg-[#2121210a]",
                            {
                                "border-[#21212185]":
                                    item?.selectedAnswer?.id === choice?.id,
                                "border-[#07C58C]": choice.correct,
                            }
                        )}
                        key={index}
                        id={(index + 1).toString()}
                    >
                        <GetIconPrefix
                            isActions={false}
                            isSelect={item?.selectedAnswer?.id === choice?.id}
                            isReview={true}
                            answerCorrect={choice.correct}
                        />
                        {choice?.text && (
                            <MathJax dynamic>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: choice?.text || "",
                                    }}
                                    className="text-xs"
                                />
                            </MathJax>
                        )}
                    </div>
                ))}
            </div>
            <div className=" hidden sm:block">
                {item?.explanation && (
                    <MathJax dynamic>
                        <span
                            dangerouslySetInnerHTML={{
                                __html:
                                    MyCrypto.decrypt(item?.explanation) || "",
                            }}
                            className={clsx(
                                "text-sm font-normal  line-clamp-2 h-full  sm:text-base",
                                {
                                    "blur-content": !userInfos.isPro,
                                }
                            )}
                        />
                    </MathJax>
                )}
            </div>

            <p
                className="text-[#6BA6FF] text-sm font-medium cursor-pointer"
                onClick={handleClickOpen}
            >
                View Detail
            </p>
            <DialogDetailQuestionReview
                item={item}
                appInfo={appInfo}
                open={open}
                onClose={handleClickClose}
                isPro={userInfos.isPro}
            />
        </div>
    );
};

export default QuestionResult;
