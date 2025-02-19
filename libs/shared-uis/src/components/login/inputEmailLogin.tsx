"use client";
import useDebounce from "@/hooks/useDebounce";
import { TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

const FN = ({
    onEnter,
    onChangeValue,
}: {
    onEnter: () => void;
    onChangeValue: (e: string) => void;
}) => {
    const [email, setEmail] = useState("");

    const value = useDebounce(email, 200);

    const validate = useCallback(() => {
        let newErrors = "";
        let isValid = true;

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors = "Please enter a valid email.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [email]);

    useEffect(() => {
        if (value && !validate()) return;
        onChangeValue(value);
    }, [value, onChangeValue, validate]);

    const [errors, setErrors] = useState("");

    return (
        <TextField
            placeholder="yourname@gmail.com"
            onChange={(e) => {
                setEmail(e.target.value);
            }}
            onBlur={validate}
            onKeyDown={(e) => {
                if (
                    e.key === "Enter" ||
                    (e.key === "NumpadEnter" && validate())
                ) {
                    onEnter();
                }
            }}
            size="medium"
            error={!!errors}
            helperText={errors}
            value={email}
            fullWidth
            sx={{
                "& .MuiOutlinedInput-root": {
                    fieldset: {
                        border: "1px solid #2121211f",
                    },
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
            }}
        />
    );
};

const InputEmailAddress = React.memo(FN);

export default InputEmailAddress;
