"use client";

import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { useIsMobile } from "@/hooks/useIsMobile";

const DescriptionComponent = () => {
    const text = `Hi, we’re ASVAB Prep, owned by ABC E-learning. Understanding the struggles of wasting time and effort with boring textbooks and crowded  
    classroom, we have worked hard with experts to create a new ASVAB learning system that allows learners access through website and mobile application, bringing convenience and higher effectiveness to the test preparation process.`;
    const text2 = `Our practice tests guide learners step-by-step through 1000+ questions with instant feedback to make the process efficient and stress-free. We also enhance their understanding of the ASVAB test by providing comprehensive information on our ASVAB blog. ASVAB Prep is here to help you prepare for service and unlock your military potential. Explore our courses to achieve academic and career success.`;

    const isMobile = useIsMobile();
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showEllipsis, setShowEllipsis] = useState(true);
    const [expandHeight, setExpandHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current && contentRef.current.scrollHeight) {
            setExpandHeight(contentRef.current.scrollHeight);
        }
        const duration = !!!isExpanded ? 400 : 0;
        /* 400 mlis > 0.3s trong css */
        const timeout = setTimeout(() => {
            setShowEllipsis(!isExpanded);
        }, duration);
        return () => clearTimeout(timeout);
    }, [isExpanded]);

    if (!isMobile) {
        return (
            <div className="about-description-component">
                <div className={`content`}>
                    {text}
                    <div className="space" />
                    {text2}
                </div>
            </div>
        );
    }
    return (
        <div className="about-description-component">
            <div
                ref={contentRef}
                className={`content ${showEllipsis ? "show-ellipsis" : "hidden-ellipsis"}`}
                style={{
                    height: isExpanded ? `${expandHeight}px` : "84px",
                }}
            >
                {text}
                <div className="space" />
                {text2}
            </div>
            <div className="toggle-button">
                <div className="button" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "Show less" : "Show more"}
                </div>
            </div>
        </div>
    );
};

export default DescriptionComponent;
