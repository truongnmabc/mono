"use client";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppSelector } from "@/redux/hooks";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState, memo, useCallback } from "react";
// import FuckAdBlock from "fuckadblock";

const AdsBlockerDetect = () => {
    const userInfo = useAppSelector(selectUserInfo);
    const [showPopUpDetectAdsBlock, setShowPopUpDetectAdsBlock] =
        useState(false);

    const handleAdBlockDetected = useCallback(() => {
        console.log("AdBlock detected!");
        if (!userInfo.isPro) {
            setShowPopUpDetectAdsBlock(true);
        }
    }, [userInfo.isPro]);

    // const handleAdBlockNotDetected = () => {
    //     console.log("AdBlock not detected!");
    // };

    // *NOTE: check lai sau
    useEffect(() => {
        // Initialize FuckAdBlock
        // const fab = new FuckAdBlock();
        // fab.onDetected(handleAdBlockDetected);
        // fab.onNotDetected(handleAdBlockNotDetected);
        // // Check for AdBlock
        // fab.check();
        // // Cleanup function to remove event listeners
        // return () => {
        //     fab.clearEventListeners();
        // };
        if (false) handleAdBlockDetected();
    }, [userInfo, handleAdBlockDetected]);

    return (
        <Dialog
            open={showPopUpDetectAdsBlock}
            sx={{
                ".MuiDialog-container ": {
                    display: "block",
                },
                ".MuiDialog-paper": {
                    borderRadius: "20px",
                    padding: "16px",
                    maxWidth: "560px",
                },
            }}
        >
            <div
                style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    lineHeight: "25px",
                    textAlign: "center",
                    marginTop: "16px",
                }}
            >
                We see you’re using an ad blocker
            </div>
            <span
                style={{
                    fontSize: "14px",
                    lineHeight: "18px",
                    textAlign: "center",
                    marginTop: "28px",
                    color: "#6E6E70",
                }}
            >
                Please help us continue to provide free, quality contents by
                disabling your ad blocker
            </span>
            <div
                onClick={() => {
                    window.location.reload();
                }}
                style={{
                    borderRadius: "12px",
                    textAlign: "center",
                    background: "#B5341F",
                    color: "#fff",
                    fontSize: "16px",
                    lineHeight: "48px",
                    marginTop: "48px",
                    cursor: "pointer",
                }}
            >
                Okay, I disabled ad blocker
            </div>
        </Dialog>
    );
};

export default memo(AdsBlockerDetect);
