"use client";

import React, { RefObject } from "react";

interface ScrollToTopArrowProps {
    scrollRef: RefObject<HTMLDivElement>;
}

const ScrollToTopArrow: React.FC<ScrollToTopArrowProps> = ({ scrollRef }) => {
    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className="fixed z-50 bottom-24 right-8 flex items-center justify-center w-12 h-12 rounded-full bg-white text-center shadow-md cursor-pointer hover:h-14 transition-all duration-200 ease-in-out sm:bottom-12"
            onClick={scrollToTop}
        >
            <div className="relative -top-px flex transition-transform duration-300 ease-in-out">
                <ArrowIconV2Svg />
            </div>
        </div>
    );
};

const ArrowIconV2Svg: React.FC = () => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8 12.6673L8 3.33398"
                stroke="#212121"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.33268 8.00065L7.99935 3.33398L12.666 8.00065"
                stroke="#212121"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ScrollToTopArrow;
