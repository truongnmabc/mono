import { MtUiButton } from "@/components/button";
import Slider from "@mui/material/Slider";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { ReviewContext } from "../../context";

const ChoiceQuestionBeforeStart = ({
    handleStartTest,
}: {
    handleStartTest: (e: number) => void;
}) => {
    const [value, setValue] = useState(0);
    const { setIsStart } = useContext(ReviewContext);

    const handleSliderChange = useCallback(
        (event: Event, newValue: number | number[]) => {
            setValue(newValue as number);
        },
        []
    );

    return (
        <Fragment>
            <div className="flex items-center justify-between gap-4 px-6 py-6">
                <p className="text-base font-medium">0</p>
                <Slider
                    value={value}
                    valueLabelDisplay="auto"
                    onChange={handleSliderChange}
                    sx={{
                        height: "10px",
                        padding: "8px 0",
                        zIndex: 0,
                        "& .MuiSlider-track": {
                            backgroundColor: "primary.main",
                            border: "none",
                            height: "10px",
                        },
                        "& .MuiSlider-thumb": {
                            backgroundColor: "white",
                            border: "1px solid var(--color-primary)",
                        },
                        "& .MuiSlider-rail": {
                            backgroundColor: "#ccc",
                            height: "10px",
                        },
                        "& .MuiSlider-valueLabel": {
                            width: "32px",
                            height: "32px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            border: "2px solid var(--text-color-primary)",
                            ":before": {
                                backgroundColor: "transparent",
                                transform:
                                    "translate(-50%, 100%) rotate(180deg)",
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderBottom:
                                    "8px solid var(--text-color-primary)",
                            },

                            "& span": {
                                fontSize: "12px",
                            },
                        },
                    }}
                />
                <p className="text-base font-medium">100</p>
            </div>
            <div className="w-full rounded-b-lg bg-[#7C6F5B0F] px-6 py-4 flex items-center justify-between">
                <p className="text-xl font-semibold">Questions: {value}</p>
                <MtUiButton
                    type="primary"
                    size="large"
                    className="text-white px-8"
                    disabled={!value}
                    onClick={() => {
                        handleStartTest(value);
                        setIsStart(true);
                    }}
                >
                    Start
                </MtUiButton>
            </div>
        </Fragment>
    );
};

export default React.memo(ChoiceQuestionBeforeStart);
