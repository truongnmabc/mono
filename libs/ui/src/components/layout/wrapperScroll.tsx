"use client";

import { SessionProvider } from "next-auth/react";
import React, { useRef, useState } from "react";
import ScrollToTopArrow from "../scrollTop";
import { MathJaxContext } from "better-react-mathjax";

const WrapperScroll = ({ children }: { children: React.ReactNode }) => {
    const [isScrollRef, setIsShowRef] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    return (
        <SessionProvider>
            <div
                id="pageScroll"
                className="w-screen h-screen flex flex-col justify-between relative overflow-auto"
                onScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
                    const { scrollTop } = e.target as HTMLElement;

                    if (scrollTop > 300 && !isScrollRef) {
                        setIsShowRef(true);
                    }
                    if (scrollTop < 300 && isScrollRef) {
                        setIsShowRef(false);
                    }
                }}
                ref={scrollRef}
            >
                <MathJaxContext>{children}</MathJaxContext>
                {isScrollRef && <ScrollToTopArrow scrollRef={scrollRef} />}
            </div>
        </SessionProvider>
    );
};
export default React.memo(WrapperScroll);
