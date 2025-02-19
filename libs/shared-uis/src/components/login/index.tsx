"use client";
import Dialog from "@mui/material/Dialog";
import React from "react";
import BannerModalLogin from "./bannerModalLogin";
import VerifyLogin from "./verifyLogin";
import "./styles.css";
export const FN = ({
    open,
    setOpen,
    allowClose = true,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    allowClose?: boolean;
}) => {
    return (
        <Dialog
            open={open}
            onClose={() => {
                if (allowClose) setOpen(false);
            }}
            className="v4-login-dialog"
        >
            <div className="flex flex-col px-4 sm:flex-row w-full h-full overflow-hidden  bg-white dark:bg-black">
                <BannerModalLogin />
                <VerifyLogin setOpen={setOpen} />
            </div>
        </Dialog>
    );
};

const ModalLogin = React.memo(FN);

export default ModalLogin;
