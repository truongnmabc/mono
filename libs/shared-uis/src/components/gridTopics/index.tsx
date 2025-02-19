"use client";

import AllowExpand from "@/components/allowExpand";
import AllowExpandProvider from "@/components/allowExpand/provider";
import TitleTopic from "@/components/home/gridTopic/item/titleTopic";
import { db } from "@/db/db.model";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectTopicsId } from "@/redux/features/study.reselect";
import { useAppSelector } from "@/redux/hooks";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";

export const generateMockTopics = (size: number): ITopicBase[] => {
    return Array.from({ length: size }, (_, index) => {
        return {
            id: index,
            contentType: 1,
            icon: "",
            name: "",
            status: 0,
            tag: "",
            totalQuestion: 0,
            parentId: 0,
            topics: [],
            slug: "",
            averageLevel: 0, // or any default value
            turn: 0, // or any default value
            partId: -1,
        };
    });
};
export const mockData: ITopicBase[] = generateMockTopics(10);

const FN = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const selectedTopics = useAppSelector(selectTopicsId);
    const [listMainTopics, setListMainTopics] =
        useState<ITopicBase[]>(mockData);
    const type = useSearchParams()?.get("type");

    const [open, setOpen] = React.useState(type === "learn");

    const handleClick = () => setOpen(!open);

    const handleGetData = useCallback(async () => {
        const listData = await db?.topics.toArray();
        if (listData) {
            setListMainTopics(listData);
        }
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div className="w-full flex flex-col gap-4">
            <div
                className="flex justify-between items-center w-full"
                onClick={handleClick}
            >
                <h3 className="font-semibold text-xl font-poppins">
                    More {appInfo.appName} Topics
                </h3>
                {open ? <ExpandLess /> : <ExpandMore />}
            </div>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <div className="w-full flex flex-col gap-2">
                    {listMainTopics?.map((subTopic, index) => (
                        <Fragment key={index}>
                            <TitleTopic
                                topic={subTopic}
                                priority={3}
                                classNames=" h-[52px] "
                                imgClassNames="w-8 h-8 sm:w-10 sm:h-10"
                            />
                            {selectedTopics === subTopic.id && (
                                <AllowExpandProvider topic={subTopic}>
                                    <AllowExpand />
                                </AllowExpandProvider>
                            )}
                        </Fragment>
                    ))}
                </div>
            </Collapse>
        </div>
    );
};

const GridTopicLeft = React.memo(FN);

export default GridTopicLeft;
