"use client";
import LazyLoadImage from "@/components/images";
import MyContainer from "@/components/container";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IAppInfo } from "@/models/app/appInfo";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, Dialog } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ListState from "../listState/listState";
const SelectState = ({
    appInfo,
    _state,
}: {
    appInfo: IAppInfo;
    _state: string;
}) => {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [openListState, setOpenListState] = useState(false);

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    return (
        <div
            className="w-full relative overflow-hidden "
            style={{
                background:
                    "linear-gradient(180deg, #E5E9FF 0%, #F0F2FE 4.75%)",
            }}
        >
            <MyContainer className="px-0">
                <div
                    className={clsx(
                        "sm:py-[48px] pt-6 px-4  sm:max-w-[800px] relative z-10 text-2xl   sm:text-[48px] sm:leading-[72px] font-bold  font-poppins "
                    )}
                >
                    <h1 className="sm:text-start text-center">
                        Take your <span className="text-[#4E60CA]">FREE</span>{" "}
                        <span className=" capitalize">{_state}</span>
                        <br />
                        <span className=" uppercase">
                            {appInfo?.appShortName}
                        </span>{" "}
                        Practice Test 2025 Now!
                    </h1>
                    <p className="text-sm  sm:text-lg pt-3 sm:pt-6 text-center sm:text-start text-[#21212185] sm:text-[#212121] font-normal ">
                        A{" "}
                        <span className="font-semibold capitalize">
                            {_state} Commercial Driver’s License
                        </span>{" "}
                        (
                        <span className=" uppercase">
                            {appInfo?.appShortName}
                        </span>
                        ) opens countless opportunities in a dynamic industry
                        like commercial trucking, and we are here to ensure you
                        seize them with confidence! Say goodbye to guesswork and
                        hello to a no-stress way to ace your{" "}
                        <span className=" uppercase">
                            {appInfo?.appShortName}
                        </span>{" "}
                        written test on your first try with{" "}
                        <span className="font-semibold">
                            <span className=" uppercase">
                                {appInfo?.appShortName}
                            </span>{" "}
                            Prep.
                        </span>
                    </p>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <div className="sm:pt-4 ">
                            <p className="text-sm sm:text-lg pt-3 sm:pt-6 font-semibold ">
                                Put your trust in us and what you can receive:
                            </p>
                            <div className="flex flex-col pt-4 max-w-[480px] gap-4">
                                <div className="text-sm sm:text-base flex gap-2  font-medium ">
                                    <IconCheck />
                                    <p className="text-sm sm:text-base text-[#21212185] sm:text-[#212121] flex-1 font-normal">
                                        <span className="text-[#212121] font-medium">
                                            Extensive{" "}
                                            <Link href={"/1"}>
                                                <span className="text-sm sm:text-base capitalize font-semibold underline text-[#3477F5]">
                                                    {_state}{" "}
                                                    <span className="text-[#3477F5] uppercase">
                                                        {appInfo?.appShortName}
                                                    </span>{" "}
                                                    practice tests
                                                </span>
                                            </Link>
                                            :{" "}
                                        </span>{" "}
                                        Ace the{" "}
                                        <span className="capitalize">
                                            {_state}
                                        </span>{" "}
                                        <span className="uppercase">
                                            {appInfo?.appShortName}
                                        </span>{" "}
                                        tests with our expert practice questions
                                        and practice tests for each endorsement.
                                    </p>
                                </div>
                                <div className="text-sm sm:text-base flex gap-2  font-medium ">
                                    <IconCheck />

                                    <p className="text-sm sm:text-base text-[#21212185] sm:text-[#212121] font-normal">
                                        <span className="text-[#212121] font-medium">
                                            Expert blogs:{" "}
                                        </span>{" "}
                                        Address all your concerns on{" "}
                                        <span className="capitalize">
                                            {_state}
                                        </span>{" "}
                                        <span className="uppercase">
                                            {appInfo?.appShortName}
                                        </span>{" "}
                                        {""}
                                        through our blog.
                                    </p>
                                </div>
                                <div className="text-sm sm:text-base flex gap-2  font-medium ">
                                    <IconCheck />
                                    <p className="text-sm sm:text-base text-[#21212185] sm:text-[#212121] font-normal ">
                                        <span className="text-[#212121] font-medium">
                                            {" "}
                                            Official{" "}
                                            <span className="uppercase">
                                                {appInfo?.appShortName}
                                            </span>{" "}
                                            handbook:{" "}
                                        </span>{" "}
                                        Comprehend all rules and tips with this
                                        ultimate reference.
                                    </p>
                                </div>
                                <div className="text-sm sm:text-base flex gap-2   ">
                                    <IconCheck />
                                    <p className="text-sm sm:text-base text-[#21212185] sm:text-[#212121] font-normal  ">
                                        <span className="text-[#212121] font-medium">
                                            100% FREE access questions:
                                        </span>{" "}
                                        Unlimited attempts, unlimited
                                        improvement for free!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Collapse>

                    <div
                        className="w-full h-8   flex sm:hidden items-center justify-center"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        <p className="text-[#3477F5] text-sm">Show More</p>
                        {open ? (
                            <ExpandLess htmlColor="#3477F5" />
                        ) : (
                            <ExpandMore htmlColor="#3477F5" />
                        )}
                    </div>

                    <div
                        onClick={() => {
                            setOpenListState(true);
                        }}
                        className="bg-[#343F82] cursor-pointer mt-3 sm:mt-8 w-full text-center sm:w-fit rounded-lg text-white px-8 py-3 sm:py-4 text-base sm:text-2xl font-semibold"
                    >
                        Not your state?
                    </div>
                </div>
            </MyContainer>
            {/* Mobile  */}
            <div className=" absolute z-0 block sm:hidden top-0 left-0 w-full aspect-video  right-0">
                <LazyLoadImage
                    src="/images/cdl_v2/image.png"
                    imgClassNames="h-full w-full"
                />
            </div>
            <div
                className="absolute top-0 block sm:hidden right-0 left-0 aspect-video w-full "
                style={{
                    marginTop: "1px",
                    background:
                        "radial-gradient(78.52% 41.96% at 50.13% 30.79%, rgba(240, 242, 254, 0.32) 0.64%, #F0F2FE 85.9%)",
                }}
            ></div>
            {/* PC  */}
            <div className=" absolute z-0 sm:block hidden bottom-0 h-full w-full   right-0">
                <LazyLoadImage
                    src="https://storage.googleapis.com/worksheetzone/CDL/images/back-cdl-state-v2.png"
                    imgClassNames="h-full w-full object-cover "
                />
            </div>
            <div
                className="absolute bottom-0 sm:block hidden left-0 h-full w-full "
                style={{
                    background:
                        "radial-gradient(34.11% 67.36% at 84.88% 63%, rgba(255, 255, 255, 0) 0%, rgba(240, 242, 254, 0.9) 100%)",
                }}
            ></div>

            <Dialog
                open={openListState}
                onClose={() => {
                    setOpenListState(false);
                }}
            >
                <ListState
                    appInfo={appInfo}
                    openListState={openListState}
                    setOpenListState={setOpenListState}
                />
            </Dialog>
        </div>
    );
};

export default React.memo(SelectState);

export const IconCheck = () => {
    return (
        <div>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    opacity="0.16"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#07C58C"
                />
                <path
                    d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z"
                    stroke="#07C58C"
                />
                <path
                    d="M10.5799 15.5796C10.3799 15.5796 10.1899 15.4996 10.0499 15.3596L7.21994 12.5296C6.92994 12.2396 6.92994 11.7596 7.21994 11.4696C7.50994 11.1796 7.98994 11.1796 8.27994 11.4696L10.5799 13.7696L15.7199 8.62961C16.0099 8.33961 16.4899 8.33961 16.7799 8.62961C17.0699 8.91961 17.0699 9.39961 16.7799 9.68961L11.1099 15.3596C10.9699 15.4996 10.7799 15.5796 10.5799 15.5796Z"
                    fill="#07C58C"
                />
            </svg>
        </div>
    );
};
