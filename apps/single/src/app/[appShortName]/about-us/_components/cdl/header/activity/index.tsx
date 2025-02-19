"use client";

import React from "react";
import CoreValueIcon from "@/components/icon/about/CoreValueIcon";
import MissionIcon from "@/components/icon/about/MissionIcon";
import VisionIcon from "@/components/icon/about/VisionIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./style.scss";
import LazyLoadImage from "@/components/images";
const introAboutUs = [
    {
        title: "Mission",
        color: "#FF6E65",
        content:
            "Deliver expertly designed practice questions, study materials, and reliable support to ensure a smooth and successful journey into the professional driving industry.<br/><br/>",
    },
    {
        title: "Vision",
        color: "#897BFF",
        content:
            "To be the go-to platform for CDL preparation for drivers to be confident, well-prepared, and able to pursue rewarding careers on the road.<br/><br/>",
    },
    {
        title: "Core Value",
        color: "#FFBC3F",
        content:
            "Provide top-quality, accurate, and up-to-date CDL prep resources, make them accessible and affordable to all, and<br/>ensure content is reliable, and crafted by experts.",
    },
];
const AboutActivityCdl = () => {
    const isMobileResize = useMediaQuery("(max-width:1200px)");

    return (
        <div className="cluster-intro-about-us max-w-component-desktop">
            {/* <img src="/images/about/back-line-component.png" alt="" /> */}
            <div className="item-intro intro-1">
                {!isMobileResize && (
                    <LazyLoadImage src="/images/about/line-1.png" alt="" />
                )}
                <MissionIcon />
                <div
                    className="title"
                    style={{
                        backgroundColor: introAboutUs[0].color,
                    }}
                >
                    {introAboutUs[0].title}
                </div>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{
                        __html: introAboutUs[0].content,
                    }}
                />
            </div>
            <div className="item-intro intro-2">
                {!isMobileResize && (
                    <LazyLoadImage src="/images/about/line-2.png" alt="" />
                )}
                <VisionIcon />
                <div
                    className="title"
                    style={{
                        backgroundColor: introAboutUs[1].color,
                    }}
                >
                    {introAboutUs[1].title}
                </div>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{
                        __html: introAboutUs[1].content,
                    }}
                />
            </div>
            <div className="item-intro intro-3">
                {!isMobileResize && (
                    <LazyLoadImage src="/images/about/line-3.png" alt="" />
                )}
                <CoreValueIcon />
                <div
                    className="title"
                    style={{
                        backgroundColor: introAboutUs[2].color,
                    }}
                >
                    {introAboutUs[2].title}
                </div>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{
                        __html: introAboutUs[2].content,
                    }}
                />
            </div>
        </div>
    );
};

export default AboutActivityCdl;
