"use client";

import CloseIcon from "@/asset/icon/CloseIcon";
import { appConfigState } from "@/redux/features/appConfig";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { sendEmailApi } from "@/services/home.service";
import AppleIcon from "@mui/icons-material/Apple";
import Divider from "@mui/material/Divider";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { MtUiButton } from "../button";
import InputCodeVerify from "./inputCodeLogin";
import InputEmailAddress from "./inputEmailLogin";

import { signIn } from "next-auth/react";

const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;

const FN = ({ setOpen }: { setOpen: (e: boolean) => void }) => {
    const [step, setStep] = useState(1);
    const [processing, setProcess] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const btnRef = useRef<HTMLDivElement | null>(null);

    const { appInfo } = useAppSelector(appInfoState);
    const { appConfig } = useAppSelector(appConfigState);

    const verifyEmail = async () => {
        setProcess(true);
        try {
            if (email?.length) {
                const data = await sendEmailApi({
                    email,
                    appName: appInfo?.appName,
                });
                if (data === "Sended email!") {
                    setStep(2);
                }
            } else {
                window.alert("Email not empty");
            }
        } catch (err) {
            console.log("🚀 ~ verifyEmail ~ err:", err);
        } finally {
            setProcess(false);
        }
    };

    const verifyCode = async () => {
        signIn("email", {
            redirect: false,
            email,
            code,
        });
        setProcess(false);
        setOpen(false);
    };

    useLayoutEffect(() => {
        if (btnRef.current && window.google) {
            window.google.accounts.id.renderButton(btnRef.current, {
                theme: "outline",
                size: "large",
                logo_alignment: "center",
                type: "standard",
                text: "signin_with",
                width: btnRef.current.clientWidth,
                height: "40px",
                locale: "en-us",
            });
            return () => {
                btnRef.current = null;
            };
        }
        return undefined;
    }, []);

    const handleLoginApple = useCallback(() => {
        if (window && window?.AppleID) {
            window.AppleID.auth.signIn();
        }
    }, []);
    return (
        <div className="w-full sm:w-1/3 flex flex-col justify-between px-4 py-6 h-full">
            <div className="flex flex-col gap-8 ">
                <div className=" fixed sm:static top-3 left-8 right-8 z-20 flex justify-end">
                    <div
                        className="rounded-full p-1 cursor-pointer hover:bg-[#2121211f] w-fit h-fit "
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon />
                    </div>
                </div>
                <div className="flex-1">
                    {step == 1 ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-center font-medium text-2xl">
                                Log in to your account
                            </p>

                            <div ref={btnRef} className="w-full h-10" />
                            {appConfig.appleClientId && (
                                <MtUiButton
                                    className="rounded"
                                    onClick={handleLoginApple}
                                    block
                                >
                                    <div className="flex items-center gap-1">
                                        <AppleIcon
                                            className="w-[18px] h-"
                                            htmlColor="#283544"
                                        />
                                        <span className="text-xs">
                                            Login with Apple
                                        </span>
                                    </div>
                                </MtUiButton>
                            )}

                            {(GOOGLE_ID || appConfig.appleClientId) && (
                                <div className="flex w-full items-center justify-between gap-1">
                                    <Divider className="flex-1" />
                                    <span className="text-xs text-[#c4c4c4]">
                                        or
                                    </span>
                                    <Divider className="flex-1" />
                                </div>
                            )}
                            <p>Email Address</p>
                            <InputEmailAddress
                                onEnter={verifyEmail}
                                onChangeValue={setEmail}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col  gap-8">
                            <p className="text-2xl text-center px-6  font-semibold">
                                Enter your verification code
                            </p>
                            <p className="text-sm text-center px-6 text-[#949494] ">
                                Please check your inbox for the verification
                                code sent to {email}
                            </p>
                            <div className="w-full">
                                <p className="text-sm pb-4">Your code</p>
                                <InputCodeVerify
                                    onChangeValue={setCode}
                                    onEnter={verifyCode}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MtUiButton
                loading={processing}
                disabled={step == 1 ? email?.length === 0 : code?.length === 0}
                onClick={() => {
                    if (step == 1) verifyEmail();
                    if (step == 2) verifyCode();
                }}
                type="primary"
                size="large"
                className="mb-4 sm:mb-0"
            >
                Verify
            </MtUiButton>
        </div>
    );
};
const VerifyLogin = React.memo(FN);
export default VerifyLogin;
