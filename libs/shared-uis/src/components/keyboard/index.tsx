"use client";
import LazyLoadImage from "@/components/images";
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

const Keyboard = () => {
    const isMobile = useIsMobile();
    if (isMobile) return null;
    return (
        <LazyLoadImage
            src="/images/keyboard.png"
            alt="keyboard"
            priority={false}
            classNames="border border-solid w-fit h-fit rounded-md p-3"
            styles={{
                boxShadow: "0px 0px 10px 0px #21212129",
            }}
        />
    );
};
export default React.memo(Keyboard);
