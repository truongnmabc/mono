import React from "react";
import "./index.scss";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import LazyLoadImage from "@/components/images";

const ActivityComponent = () => {
    const notIsMobile = useMediaQuery("(min-width: 600px)");
    const srcDesktopMobile = notIsMobile ? "" : "/mobile";
    const listData = [
        {
            colorCircle: "blue",
            icon: "eye",
            content: "Vision",
            subContent:
                "To become a trusted, high-quality ASVAB exam preparation platform with a high pass rate.",
        },
        {
            colorCircle: "red",
            icon: "mount",
            content: "Mission",
            subContent:
                "Empower aspiring Americans to enlist in the U.S. Armed Forces successfully.",
        },
        {
            colorCircle: "green",
            icon: "hand",
            content: "Brand Essence",
            subContent:
                "Keep the customer at the forefront and deliver exceptional learning experiences.",
        },
        {
            colorCircle: "orange",
            icon: "heart",
            content: "Core Value",
            subContent:
                "Premium-quality products, great prices, and superior after-sales service.",
        },
    ];

    return (
        <div className="about-activity-component max-w-component-desktop">
            <div className="ecosystem">
                <Image
                    src={`/images/about${srcDesktopMobile}/ecosystem.png`}
                    alt="ecosystem"
                    draggable="false"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="about-activity-container">
                {listData.map((data, index) => (
                    <div key={index} className={"activity-box " + data.icon}>
                        <div className={"circle-icon " + data.colorCircle}>
                            <LazyLoadImage
                                classNames={data.icon}
                                src={`/images/about/mobile/${data.icon}.png`}
                                alt={data.icon}
                            />
                        </div>
                        <div className="content">{data.content}</div>
                        <div className="sub-content">{data.subContent}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityComponent;
