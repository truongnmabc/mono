"use client";
import React from "react";
import CircleProgress from "@/components/circleProgress";
import { useIsMobile } from "@/hooks/useIsMobile";

const DashboardCard = ({
    correct,
    passing,
    percent,
    total,
}: {
    total: number;
    correct: number;
    percent: number;
    passing: number;
}) => {
    const isMobile = useIsMobile();
    return (
        <div className="relative mx-auto min-w-[320px]  w-full sm:w-fit h-[300px] sm:h-[340px] z-0 flex flex-col items-center">
            <CircleProgress
                percentage={percent}
                color="#12E1AF"
                size={isMobile ? 240 : 320}
                bgColor="#F87171"
                strokeWidth={16}
                halfCircle
                textClassName="text-7xl font-bold"
                textAttributes={{
                    fill: "#F87171",
                }}
            />

            <div className=" absolute  bottom-0 left-0 w-full z-20">
                <div className="mt-4 px-8 sm:px-0 flex justify-between w-full ">
                    <div className="flex  gap-2">
                        <div className="h-1 mt-3 rounded-md bg-[#15CB9F] w-3"></div>
                        <div>
                            <p className="text-[#939393] text-lg font-normal">
                                Correct
                            </p>
                            <p className="text-[#0C1827] text-lg font-semibold">
                                {correct} questions
                            </p>
                        </div>
                    </div>
                    <div className="flex  gap-2">
                        <div className="h-1 mt-3 rounded-md bg-[#EF4444] w-3"></div>

                        <div>
                            <p className="text-[#939393] text-lg font-normal">
                                Incorrect
                            </p>
                            <p className="text-[#0C1827] text-lg font-semibold">
                                {total - correct} questions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 w-full bg-[#F2EADB] z-10 overflow-hidden relative rounded-xl p-3 flex flex-col gap-2 items-center">
                    <div className="w-full flex items-center z-10 justify-between">
                        <p className="text-sm font-medium ">
                            Passing Probability
                        </p>
                    </div>

                    <div className="relative custom-progress w-full h-5 mt-1 z-10 bg-white rounded-full">
                        <div
                            className="absolute w-1/2 top-0 left-0 h-5 bg-yellow-500 rounded-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #E3C151 0%, #E3A651 50%, #F39153 100%)",
                                width: `${passing < 3 ? 6 : passing}%`,
                            }}
                        ></div>
                        <div className="absolute w-full h-5 leading-5 text-primary text-xs font-semibold text-center">
                            + {passing.toFixed(2)}%
                        </div>
                    </div>
                    <div className="absolute inset-0 pt-2 z-0">
                        <Pattern />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DashboardCard);

export const Pattern = () => {
    return (
        <svg
            width="295"
            height="73"
            viewBox="0 0 295 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M228.605 91.0281C228.605 140.711 177.703 181.209 114.603 181.209C51.5029 181.209 0.6 140.711 0.6 91.0281C0.6 41.3455 51.5029 0.847314 114.603 0.847314C177.703 0.847314 228.605 41.3455 228.605 91.0281Z"
                stroke="white"
                strokeOpacity="0.32"
                strokeWidth="1.2"
            />
            <path
                d="M294.277 98.7541C294.277 123.225 280.506 145.434 258.131 161.548C235.758 177.662 204.819 187.647 170.617 187.647C136.415 187.647 105.476 177.662 83.1021 161.548C60.7275 145.434 46.9564 123.225 46.9564 98.7541C46.9564 74.2831 60.7275 52.0741 83.1021 35.9598C105.476 19.8461 136.415 9.86099 170.617 9.86099C204.819 9.86099 235.758 19.8461 258.131 35.9598C280.506 52.0741 294.277 74.2831 294.277 98.7541Z"
                stroke="white"
                strokeOpacity="0.32"
                strokeWidth="1.2"
            />
        </svg>
    );
};
