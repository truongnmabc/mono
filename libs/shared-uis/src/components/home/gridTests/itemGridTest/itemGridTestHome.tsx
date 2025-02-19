import MtUiRipple, { useRipple } from "@/components/ripple";
import { TypeParam } from "@/constants";
import RouterApp from "@/constants/router.constant";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { resetState } from "@/redux/features/game";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import initTestQuestionThunk from "@/redux/repository/game/initData/initPracticeTest";
import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback } from "react";
import { IPropsItemTest } from "../type";
import ListPracticeTest from "./listPracticeTest";

const ItemGridTest: React.FC<IPropsItemTest> = ({ item }) => {
    const [open, setOpen] = React.useState(false);
    const isMobile = useIsMobile();
    const router = useRouter();
    const userInfo = useAppSelector(selectUserInfo);

    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();

    const dispatch = useAppDispatch();

    const handleCustomTest = useCallback(async () => {
        const isTester = sessionStorage.getItem("isTester");
        if (!userInfo.isPro && !isTester) {
            const _href = `${RouterApp.Get_pro}`;
            router.push(_href);
            return;
        }
        const tests = await db?.testQuestions
            .where("gameMode")
            .equals("customTets")
            .filter((item) => item.status === 0)
            .first();

        dispatch(
            initCustomTestThunk({
                testId: tests?.id || -1,
            })
        );
        if (tests) {
            router.push(`${RouterApp.Custom_test}?testId=${tests.id}`);
        } else {
            router.push(RouterApp.Custom_test);
        }
    }, [dispatch, router, userInfo]);

    const handleFinalTest = useCallback(async () => {
        const isTester = sessionStorage.getItem("isTester");

        if (!userInfo.isPro && !isTester) {
            const _href = `${RouterApp.Get_pro}`;
            router.push(_href);
            return;
        }
        const data = await db?.testQuestions
            .where("gameMode")
            .equals("finalTests")
            .first();

        const isSuccess = data?.status === 1;
        if (!isSuccess) {
            dispatch(initFinalTestThunk());
            router.push(RouterApp.Final_test);
        } else {
            const _href = `${RouterApp.ResultTest}?type=${TypeParam.finalTest}&testId=${data.id}`;
            router.push(_href);
        }
    }, [dispatch, router, userInfo]);

    const handleDiagnosticTest = useCallback(async () => {
        const diagnostic = await db?.testQuestions
            .where("gameMode")
            .equals("diagnosticTest")
            .first();

        const isSuccess = diagnostic?.status === 1;

        if (!isSuccess) {
            dispatch(initDiagnosticTestQuestionThunk());
            router.push(RouterApp.Diagnostic_test);
        } else {
            const _href = `${RouterApp.ResultTest}?type=${TypeParam.diagnosticTest}&testId=${diagnostic.id}`;
            router.push(_href);
        }
    }, [dispatch, router]);

    const handlePracticeTest = useCallback(async () => {
        let _href = "";
        const res = await db?.testQuestions
            .where("gameMode")
            .equals("practiceTests")
            .toArray();

        if (res) {
            const currentTest = res.find((item) => item?.status === 0);
            if (currentTest && currentTest?.id) {
                const id = currentTest?.id;
                dispatch(
                    initTestQuestionThunk({
                        testId: id,
                    })
                );

                _href = `/study/${TypeParam.practiceTest}?type=practiceTests&testId=${id}`;
            } else {
                _href = `${RouterApp.ResultTest}?type=${TypeParam?.practiceTest}&testId=${res[0]?.id}`;
            }
            router.push(_href);
        }
    }, [dispatch, router]);

    const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            onRippleClickHandler(e);
            dispatch(resetState());
            switch (item.id) {
                case "CT":
                    handleCustomTest();
                    break;
                case "FT":
                    handleFinalTest();
                    break;
                case "DT":
                    handleDiagnosticTest();
                    break;
                case "PT":
                    if (isMobile) return setOpen(!open);
                    handlePracticeTest();
                    break;
                default:
                    break;
            }
        },
        [
            item.id,
            dispatch,
            handleCustomTest,
            handleFinalTest,
            handleDiagnosticTest,
            handlePracticeTest,
            onRippleClickHandler,
            isMobile,
            open,
        ]
    );

    return (
        <Fragment>
            <Grid2
                size={{
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 3,
                }}
            >
                <div
                    className="flex border p-2 relative hover:border-primary overflow-hidden bg-white cursor-pointer w-full h-[52px] sm:h-[72px] rounded-md"
                    onClick={handleClick}
                >
                    <div
                        className="h-full aspect-square    rounded-md flex  items-center justify-center rounded-tl-md"
                        style={{
                            backgroundColor: item.color,
                        }}
                    >
                        <div className="w-5 h-5 sm:w-8 sm:h-8">{item.icon}</div>
                    </div>
                    <h3 className="pl-4 flex-1 text-base sm:text-lg  flex items-center justify-start font-medium ">
                        {item.name}
                    </h3>
                    <MtUiRipple ripples={ripples} onClear={onClearRipple} />
                </div>
            </Grid2>
            {item.id === "PT" && <ListPracticeTest open={open} />}
        </Fragment>
    );
};

export default ItemGridTest;
