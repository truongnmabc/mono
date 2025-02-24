"use client";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";
import React from "react";

export const AntTabs = styled(Tabs)({
    borderBottom: "1px solid #e8e8e8",
    backgroundColor: "#E9E6D7",
    borderRadius: "8px",
    width: "100%",
    height: "40px",
    minHeight: "40px",
    padding: "4px 4px",
    "& .MuiTabs-indicator": {
        background: "white",
        color: "#7C6F5B",
        fontWeight: "500",
        with: "100%",
        height: "32px",
        borderRadius: "6px",
        border: "1px solid #fff",
        boxShadow: "0px 1px 2px 0px #0000000D",
        zIndex: 1,
    },
});

interface StyledTabProps {
    label: React.ReactNode;
}

export const AntTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
))(() => ({
    height: "32px",
    minHeight: "32px",
    width: "33%",
    padding: "4px 16px",
    fontSize: "16px",
    textTransform: "none",
    borderRadius: "6px",
    color: "#212121",
    position: "relative",
    zIndex: 2,
    "&.Mui-selected": {
        color: "#7C6F5B",
        fontWeight: "500",
    },
    "@media (max-width: 600px)": {
        fontSize: "12px", // Font chữ nhỏ hơn cho mobile
        padding: "4px 4px",
    },
}));
