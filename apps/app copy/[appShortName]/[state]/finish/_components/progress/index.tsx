import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import "./styles.css";

ChartJS.register(ArcElement, Tooltip, Legend);
const labels = ["correct", "incorrect"];
const backgroundColors = ["#12E1AF", "#F9586B"];

const ProgressFinishPage = ({
    correct,
    total,
}: {
    correct: number;
    total: number;
}) => {
    const data = {
        labels,
        datasets: [
            {
                label: "Questions",
                data: [correct, total - correct],
                backgroundColor: backgroundColors,
                borderWidth: 4,
                borderColor: "transparent",
                cutout: "78%",
                borderRadius: 16,
                spacing: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div className="w-full h-full flex items-center flex-col justify-center">
            <div className="w-[160px] relative h-[160px]">
                <svg
                    width="160px"
                    height="160px"
                    viewBox="0 0 160 160"
                    className="circular-progress"
                >
                    <circle className="bg"></circle>
                </svg>
                <Doughnut
                    width={160}
                    height={160}
                    data={data}
                    options={options}
                    className="z-10 absolute"
                />
                <div className="absolute z-0 bottom-0 right-0 top-0 left-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-[#7C6F5B] text-2xl font-semibold">
                            {correct}/{total}
                        </p>
                        <p className="text-base font-normal text-[#7C6F5B]">
                            questions
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-sm sm:text-base pt-6 text-center sm:pt-8 font-normal">
                You correctly answered{" "}
                <span className="text-base font-semibold">
                    {correct}/{total}
                </span>{" "}
                questions on the first turn.
            </div>
        </div>
    );
};

export default React.memo(ProgressFinishPage);
