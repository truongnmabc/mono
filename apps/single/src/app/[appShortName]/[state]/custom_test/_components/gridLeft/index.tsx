"use client";
import { IconDelete, IconEdit, IconPlus } from "@/components/icon/iconGridLeft";
import { TypeParam } from "@/constants";
import RouterApp from "@/constants/router.constant";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ITestBase } from "@/models/tests";
import {
    resetState,
    setCurrentTopicId,
    setIndexSubTopic,
} from "@/redux/features/game";
import {
    selectCurrentSubTopicIndex,
    selectIsCreateNewTest,
    selectIsDataLoaded,
    selectListQuestion,
    selectShouldLoading,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import choiceStartCustomTestThunk from "@/redux/repository/game/choiceAnswer/choiceStartTest";
import { Tooltip } from "@mui/material";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import ModalDelete from "../modalDelete";
import ModalSettingCustomTest from "../modalSetting";

const GridLeftCustomTest = () => {
    const [listTest, setListTest] = useState<ITestBase[]>([]);
    const [openModalSetting, setOpenModalSetting] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [itemSelect, setItemSelect] = useState<ITestBase | null>(null);
    const listQuestion = useAppSelector(selectListQuestion);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);
    const isDataLoaded = useAppSelector(selectIsDataLoaded);
    const isLoading = useAppSelector(selectShouldLoading);
    const isCreateNewTest = useAppSelector(selectIsCreateNewTest);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isCreateNewTest) setOpenModalSetting(true);
    }, [isCreateNewTest]);

    useEffect(() => {
        const handleGetData = async () => {
            const list = await db?.testQuestions
                .where("gameMode")
                .equals("customTets")
                .sortBy("createDate");

            if (list?.length === 0) {
                setOpenModalSetting(true);
            }
            if (list?.length) setListTest(list);
        };
        if (listQuestion?.length) {
            handleGetData();
            return;
        }

        if (listQuestion?.length === 0 && isDataLoaded)
            setOpenModalSetting(true);

        return () => setOpenModalSetting(false);
    }, [listQuestion, isDataLoaded, isLoading]);

    const onClose = useCallback(() => {
        setOpenModalSetting(false);
        setItemSelect(null);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDelete(false);
    }, []);

    const handleDelete = useCallback(async () => {
        if (itemSelect) {
            await db?.testQuestions.where("id").equals(itemSelect?.id).delete();

            const startTest = await db?.testQuestions
                .where("gameMode")
                .equals("customTets")
                .filter((item) => item.status === 0)
                .first();

            setListTest((prev) => {
                const updatedList = prev.filter(
                    (item) => item.id !== itemSelect.id
                );
                if (!updatedList.length) {
                    dispatch(resetState());
                    setItemSelect(null);
                } else if (startTest) {
                    const index = updatedList.findIndex(
                        (i) => i.id === startTest.id
                    );
                    dispatch(setIndexSubTopic(index !== -1 ? index + 1 : 1));
                }
                return updatedList;
            });

            setOpenDelete(false);
        }
    }, [itemSelect, dispatch]);

    const handleClickChoiceTest = useCallback(
        async (item: ITestBase, index: number) => {
            const tests = await db?.testQuestions.get(item.id);
            if (tests?.status === 1) {
                const _href = `${RouterApp.ResultTest}?type=${TypeParam.customTest}&testId=${item.id}`;
                router.replace(_href);
                return;
            }

            dispatch(
                choiceStartCustomTestThunk({
                    item: {
                        ...item,
                        indexSubTopic: index,
                    },
                })
            );
            dispatch(setCurrentTopicId(item.id));

            router.replace(`${RouterApp.Custom_test}?testId=${item?.id}`);
        },
        [dispatch, router]
    );

    return (
        <Fragment>
            {!isMobile && (
                <Fragment>
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-xl">Custom Test</p>
                        <Tooltip title="Add Custom Test">
                            <div
                                onClick={() => {
                                    setOpenModalSetting(true);
                                    setItemSelect(null);
                                }}
                                className="w-7 h-7 cursor-pointer rounded-full bg-[#21212114] flex items-center justify-center "
                            >
                                <IconPlus />
                            </div>
                        </Tooltip>
                    </div>
                    {listTest?.length ? (
                        <div className="flex flex-col gap-3 bg-white p-4 rounded-md">
                            {listTest?.map((item, index) => (
                                <div
                                    key={index}
                                    className={clsx(
                                        "flex bg-[#2121210A]   border border-solid rounded-lg px-3 py-[10px] gap-2 justify-between items-center",
                                        {
                                            "border-primary":
                                                indexSubTopic - 1 === index,
                                        }
                                    )}
                                >
                                    <Tooltip
                                        title={
                                            indexSubTopic - 1 !== index
                                                ? `Start Custom Test ${
                                                      index + 1
                                                  }`
                                                : ""
                                        }
                                    >
                                        <p
                                            className={clsx(
                                                "text-sm hover:text-primary cursor-pointer font-medium",
                                                {
                                                    "pointer-events-none":
                                                        indexSubTopic - 1 ===
                                                        index,
                                                }
                                            )}
                                            onClick={() => {
                                                handleClickChoiceTest(
                                                    item,
                                                    index + 1
                                                );
                                            }}
                                        >
                                            Custom Test {index + 1}
                                        </p>
                                    </Tooltip>

                                    <div className="flex items-center gap-2">
                                        <Tooltip title="Edit">
                                            <div
                                                onClick={() => {
                                                    setItemSelect(item);
                                                    setOpenModalSetting(true);
                                                }}
                                                className={clsx(
                                                    "w-6 h-6 rounded flex cursor-pointer hover:bg-primary items-center justify-center bg-[#2121210F]"
                                                )}
                                            >
                                                <IconEdit />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <div
                                                onClick={() => {
                                                    setItemSelect(item);
                                                    setOpenDelete(true);
                                                }}
                                                className={clsx(
                                                    "w-6 h-6 rounded flex items-center hover:bg-primary cursor-pointer justify-center bg-[#2121210F]",
                                                    {
                                                        "pointer-events-none":
                                                            indexSubTopic -
                                                                1 ===
                                                            index,
                                                    }
                                                )}
                                            >
                                                <IconDelete />
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <></>
                    )}
                </Fragment>
            )}
            {openDelete && (
                <ModalDelete
                    openDelete={openDelete}
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                />
            )}
            {openModalSetting ? (
                <ModalSettingCustomTest
                    item={itemSelect}
                    isShowBtnCancel={
                        !isCreateNewTest &&
                        (listTest?.length > 0 || listQuestion?.length > 0)
                    }
                    open={openModalSetting}
                    onClose={onClose}
                    indexSubTopic={listTest?.length + 1}
                />
            ) : null}
        </Fragment>
    );
};

export default React.memo(GridLeftCustomTest);
