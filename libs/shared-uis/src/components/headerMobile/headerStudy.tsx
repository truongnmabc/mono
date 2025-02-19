"use client";

import IconBack from "@/components/icon/iconBack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { getKeyTest, getLastPathSegment } from "../titleQuestion";
import {
    selectCurrentSubTopicIndex,
    selectGameMode,
} from "@/redux/features/game.reselect";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import IconSubmit from "../icon/iconSubmit";

const HeaderStudy = () => {
    const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);
    const type = useAppSelector(selectGameMode);
    const param = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const defaultTitle =
        getKeyTest(param?.["slug"]) || getLastPathSegment(pathname);

    const dispatch = useAppDispatch();
    const handleSubmit = () => {
        dispatch(shouldOpenSubmitTest(true));
    };
    return (
        <Fragment>
            <div className="flex sm:hidden items-center p-2 justify-between">
                <div
                    onClick={() => {
                        router.back();
                    }}
                    className="cursor-pointer"
                >
                    <IconBack size={20} />
                </div>

                <div className=" text-center flex-1 capitalize text-lg font-medium">
                    {type === "learn" ? `Core ${indexSubTopic}` : defaultTitle}
                </div>
                {type !== "learn" && (
                    <div onClick={handleSubmit}>
                        <IconSubmit />
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default React.memo(HeaderStudy);
