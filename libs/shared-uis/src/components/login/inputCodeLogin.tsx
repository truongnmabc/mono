"use client";
import useDebounce from "@/hooks/useDebounce";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const FN = ({
    onEnter,
    onChangeValue,
}: {
    onEnter: () => void;
    onChangeValue: (e: string) => void;
}) => {
    const [code, setCode] = useState("");

    const value = useDebounce(code, 200);

    useEffect(() => {
        onChangeValue(value);
    }, [value, onChangeValue]);

    return (
        <TextField
            placeholder="Enter your code here"
            onChange={(e) => {
                setCode(e.target.value);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "NumpadEnter") {
                    onEnter();
                }
            }}
            size="medium"
            fullWidth
            value={code}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& input": {
                        fontSize: "14px",
                        padding: "11px 14px",
                    },
                    "&:hover fieldset": {
                        borderColor: "var(--text-color-primary)",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "var(--text-color-primary)",
                    },
                },
                "& .MuiFormHelperText-root": {
                    color: "red",
                },
            }}
        />
    );
};

const InputCodeVerify = React.memo(FN);

export default InputCodeVerify;
