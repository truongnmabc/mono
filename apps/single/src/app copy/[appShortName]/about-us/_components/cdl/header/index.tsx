import { useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import DropDown from "@/components/icon/about/DropDown";

import "./style.scss";
const contentPreview = [
    "Welcome to CDL Prep, owned by ABC Elearning.\n<span></span>\nCDL Prep is a trusted resource designed to help you pass your Commercial Driver’s License exams. Our platform offers expertly crafted practice questions, and insightful blog posts on CDL topics, requirements, and regulations.\n <span></span>\nCDL Prep is here to support your learning journey with resources that are accessible, effective, and tailored to help you succeed in your CDL career in your state.",
];
const listRecord = [
    {
        summary: "6 Years of Establishment",
        contentR:
            "With 6+ years of experience, CDL Prep has supported aspiring drivers in their test preparation.",
    },
    {
        summary: "1.4M+ Users",
        contentR:
            "More than 200.000 users have trusted CDL Prep for comprehensive and effective CDL practice tests.",
    },
    {
        summary: "96% Passing Rate",
        contentR:
            "Our users have achieved a 96% passing rate, a testament to our quality and effectiveness.",
    },
];
const AboutHeaderCdl = () => {

    const isMobile = useMediaQuery("(max-width:768px)");
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="about-us-top">
            <div className="cluster-info-title max-w-component-desktop">
                <div className="content-about-us">
                    <div className="title">ABOUT US</div>
                    <div className="list-contents" id="list-contents">
                        <div
                            className={
                                "content " +
                                (isExpanded ? "show" : "hide")
                            }
                            dangerouslySetInnerHTML={{
                                __html: contentPreview,
                            }}
                        />
                        {isMobile && (
                            <div
                                className="show-more"
                                onClick={() => {
                                    const timeout = setTimeout(() => {
                                        setIsExpanded(!isExpanded);
                                    }, 100);
                                    return () => clearTimeout(timeout);
                                }}
                            >
                                {isExpanded ? "Show Less" : "Show More"}{" "}
                                <DropDown isRotated={isExpanded} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="list-records">
                    {listRecord.map((record, index) => (
                        <div
                            className="record"
                            key={index}
                            id={`record-about-us-${index}`}
                        >
                            <div className="summary">
                                {record.summary}
                            </div>
                            <div className="content">
                                {record.contentR}
                            </div>
                        </div>
                    ))}
                </div>
            </div></div>
    )
}

export default AboutHeaderCdl