import useDebounce from "@/hooks/useDebounce";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";

type ICardProgress = {
    title: string;
    suffix?: string;
    max: number;
    changeProgress: (e: number) => void;
    defaultValue: number;
    required?: boolean;
    errorMess?: string;
    disabled?: boolean;
};

const CardProgress = ({
    title,
    suffix,
    max,
    defaultValue,
    changeProgress,
    required,
    errorMess,
    disabled,
}: ICardProgress) => {
    const [value, setValue] = useState(defaultValue);
    const progress = useDebounce(value, 500);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        if (progress !== defaultValue) {
            changeProgress(progress);
        }
    }, [progress, changeProgress, defaultValue]);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };

    return (
        <div>
            <div className="w-full h-fill ">
                <div className="w-full flex items-center justify-between">
                    <p className="text-base font-medium">{title}</p>
                    <div className="flex items-center gap-1">
                        <span className="text-base font-medium">{value}</span>
                        <span className="text-base font-medium">{suffix}</span>
                    </div>
                </div>
                <div className="bg-white mt-2 w-full h-fill p-4 rounded-lg border border-solid">
                    <Slider
                        value={value}
                        disabled={disabled}
                        onChange={handleSliderChange}
                        sx={{
                            height: "10px",
                            padding: "8px 0",
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
                        }}
                    />
                    <div className="flex text-xs font-medium w-full items-center justify-between">
                        <span>0</span>
                        <span>{max}</span>
                    </div>
                </div>
            </div>
            {required && errorMess && (
                <p className="text-red-500 mt-2 text-sm">{errorMess}</p>
            )}
        </div>
    );
};

export default CardProgress;
