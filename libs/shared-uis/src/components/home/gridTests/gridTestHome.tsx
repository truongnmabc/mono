"use client";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import { Grid2 } from "@mui/material";
import React from "react";
import CustomTestSvg from "./itemGridTest/icon/iconCustomTest";
import DiagnosticTestSvg from "./itemGridTest/icon/iconDiagnosticTest";
import FinalTestSvg from "./itemGridTest/icon/iconFinalTest";
import PracticeTestsSvg from "./itemGridTest/icon/iconPracticeTests";
import ItemGridTest from "./itemGridTest/itemGridTestHome";

export const mockGirdTests = [
    {
        id: "DT",
        icon: <DiagnosticTestSvg />,
        name: "Diagnostic Test",
        color: "#309F8C",
    },
    {
        id: "PT",
        icon: <PracticeTestsSvg />,
        name: "Practice Tests",
        color: "#4797B1",
    },
    {
        id: "FT",
        icon: <FinalTestSvg />,
        color: "#639CDD",
        name: "Final Test",
    },
    {
        id: "CT",
        icon: <CustomTestSvg />,
        color: "#686EE2",
        name: "Custom Test",
    },
];
const GridTest = () => {
    const appInfo = useAppSelector(selectAppInfo);

    return (
        <div className="w-full mt-6 sm:mt-12">
            <h3 className="sm:text-[40px] sm:leading-[60px] text-center text-2xl font-bold">
                Take Full {appInfo.appName} Practice Test
            </h3>
            <h4 className="text-sm my-2 sm:mt-8 sm:text-base text-[#212121CC] sm:text-[#212121] font-normal  text-center">
                Ace your exam with our comprehensive practice tests! Get started
                with a Diagnostic Test to identify your strengths and
                weaknesses. Then, master the content with our Practice Tests.
                Finally, fine-tune your skills with the Final Test and Custom
                Test for ultimate confidence.
            </h4>
            <div className="w-full mt-6 sm:mt-10 ">
                <Grid2 container spacing={2}>
                    {mockGirdTests.map((test) => (
                        <ItemGridTest key={test.id} item={test} />
                    ))}
                </Grid2>
            </div>
        </div>
    );
};

export default React.memo(GridTest);
