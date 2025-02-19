"use client";
import { MtUiButton } from "@/components/button";
import dynamic from "next/dynamic";
const Sheet = dynamic(() => import("@/components/sheet"), {
    ssr: false,
});
import { trackingEventGa4 } from "@/services/googleEvent";
import { useRouter } from "next/navigation";
import React from "react";

const MobileDrawerConfirmExit = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (agr: boolean) => void;
}) => {
    const router = useRouter();
    const allowSubmit = false;
    const handleExitStudy = () => {
        setOpen(false);
        router.back();
    };

    const handleSubmit = () => {
        trackingEventGa4({
            eventName: "drawer_submit_mobile",
            value: {
                from: window.location.href,
            },
        });
        //   dispatch(onGameSubmitted());
    };
    return (
        <Sheet
            visible={open}
            onClose={() => setOpen(false)}
            mask
            swipeToClose
            handler
            maskClosable
            autoHeight
        >
            <div className="px-6 w-full flex flex-col gap-4 h-full pt-2 pb-4">
                <div className="text-lg font-poppins text-center font-semibold">
                    Do you really want to exit?
                </div>
                <div className="text-sm font-poppins text-center font-medium">
                    Your progress will be saved!
                </div>
                <div className="w-full flex flex-col gap-3">
                    {allowSubmit && (
                        <MtUiButton block type="primary" onClick={handleSubmit}>
                            Submit
                        </MtUiButton>
                    )}
                    <MtUiButton
                        animated
                        onClick={handleExitStudy}
                        className="border-[#dadce0]"
                        block
                        type="default"
                    >
                        Exit
                    </MtUiButton>
                </div>
            </div>
        </Sheet>
    );
};
export default React.memo(MobileDrawerConfirmExit);
