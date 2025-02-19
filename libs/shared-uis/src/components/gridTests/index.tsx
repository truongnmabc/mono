"use client";
import { db } from "@/db/db.model";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import ItemTestLeft from "./itemTest";
import { IGameMode } from "@/models/tests";

type IListTest = {
    parentId: number;
    duration: number;
};
const FN = () => {
    const appInfo = useAppSelector(selectAppInfo);

    const [listPracticeTests, setListPracticeTests] = useState<IListTest[]>([]);
    const type = useSearchParams()?.get("type") as IGameMode;

    const [open, setOpen] = React.useState(type === "practiceTests");

    const handleClick = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const handleGetData = useCallback(async () => {
        const listData = await db?.testQuestions
            .filter((test) => test.gameMode === "practiceTests")
            .toArray();
        if (listData) {
            setListPracticeTests(
                listData?.map((item) => ({
                    duration: item.totalDuration,
                    parentId: item.id,
                }))
            );
        }
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div className="text-xl font-poppins capitalize font-semibold">
            <div
                className="flex justify-between items-center w-full"
                onClick={handleClick}
            >
                <h3 className="font-semibold text-xl font-poppins">
                    More{" "}
                    <span className="uppercase">{appInfo.appShortName}</span>{" "}
                    Tests
                </h3>
                {open ? <ExpandLess /> : <ExpandMore />}
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <div className="w-full flex mt-3 flex-col gap-2">
                    {listPracticeTests?.map((test, index) => (
                        <ItemTestLeft key={index} index={index} test={test} />
                    ))}
                </div>
            </Collapse>
        </div>
    );
};

const GridTestsLeft = React.memo(FN);
export default GridTestsLeft;
