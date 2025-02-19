"use client";
import MtUiSkeleton from "@/components/loading-skeleton";
import dynamic from "next/dynamic";
import React from "react";

const PassingProbability = dynamic(() => import("@/components/passing"), {
    ssr: false,
    loading: () => <Loading />,
});
const PassingHome = ({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) return <PassingProbability />;
    return null;
};

export default PassingHome;

const Loading = () => {
    return (
        <div className="p-4 rounded-md bg-[#2121210A] transition-all dark:bg-black">
            <h3 className="font-semibold truncate text-lg">
                Passing Probability
            </h3>
            <div className="mt-3 h-12 w-full custom-progress relative">
                <MtUiSkeleton className="h-full w-full" />
            </div>
        </div>
    );
};
