"use client";

import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import React, { CSSProperties } from "react";
// import "./styles.css";
import "./style.scss";

import IconLinkStoreApp from "@/components/iconLinkStoreApp";
import QRCode from "react-qr-code";
import LazyLoadImage from "@/components/images";

const DownloadApp = () => {
    const { appInfo } = useAppSelector(appInfoState);
    const features = [
        {
            title: "No internet required",
            icon: (
                <LazyLoadImage
                    alt="No internet required"
                    src="/images/home/v4-no-internet-required.webp"
                    classNames="w-6 h-6"
                />
            ),
            mobile: true,
        },
        {
            title: "Instant feedback",
            icon: (
                <LazyLoadImage
                    alt="Instant feedback"
                    src="/images/home/v4-instant-feedback.webp"
                    classNames="w-6 h-6"
                />
            ),
            mobile: true,
        },
        {
            title:
                appInfo.totalQuestion -
                (appInfo.totalQuestion % 10) +
                "+ unique questions",
            icon: (
                <LazyLoadImage
                    alt="unique questions"
                    src="/images/home/v4-unique-questions.webp"
                    classNames="w-6 h-6"
                />
            ),
            mobile: true,
        },
        {
            title: "Easy to use",
            icon: (
                <LazyLoadImage
                    alt="easy to use"
                    src="/images/home/v4-easy-to-use.webp"
                    classNames="w-6 h-6"
                />
            ),
            mobile: true,
        },

        {
            title: "No registration",
            icon: (
                <LazyLoadImage
                    alt="No registration"
                    src="/images/home/v4-no-registration.webp"
                    classNames="w-6 h-6"
                />
            ),
            mobile: true,
        },
        {
            title: appInfo.hasState
                ? "State Specific"
                : "Track passing probability",
            icon: (
                <LazyLoadImage
                    alt={
                        appInfo.hasState
                            ? "State Specific"
                            : "Track passing probability"
                    }
                    src="/images/home/v4-track-passing-probability.webp"
                    classNames="w-6 h-6"
                />
            ),
            mobile: true,
        },
    ];
    const customStyles: CSSProperties & Record<string, string> = {
        "--img-mobile-url": `url(/images/home/asvab/banner-download-app-desktop.webp)`,
        "--img-desktop-url": `url(/images/home/asvab/banner-download-app-desktop.webp)`,
        "--background-mobile-url": `url(/images/home/asvab/ballon-mobile.svg)`,
        "--background-desktop-url": `url(/images/home/asvab/ballon-desktop.svg)`,
    };
    const featuresMobile = [...features];
    featuresMobile.splice(2, 0, featuresMobile.splice(4, 1)[0])
    return (
        <div className="v4-banner-download-app-0 ">
            <div className="v4-banner-download-app-1">
                <div className="v4-banner-download-app-11">
                    <figure
                        className="v4-banner-download-app-background"
                        style={customStyles}
                    ></figure>
                    <div className="v4-banner-download-app-content-0">
                        <div>
                            <strong>DOWNLOAD</strong><br />
                            <p>OUR APP</p>
                        </div>

                        <div className="v4-banner-download-app-grid-feature-0">
                            {features?.map((f) => (
                                <div
                                    className="grid-feature-item"
                                    key={f.title}
                                >
                                    {f.icon}
                                    <span>{f.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid-feature-item">
                            {featuresMobile
                                .filter((f) => f?.mobile)
                                .map((f) => f.title)
                                .join(" - ")}
                        </div>

                        <div className="v4-banner-download-app-method-0">
                            <div className="flex flex-col gap-2">
                                <IconLinkStoreApp type="ios" />
                                <IconLinkStoreApp type="android" />
                            </div>

                            <div className="v4-banner-download-app-method-qr w-[50px] sm:w-[118px]">
                                <QRCode
                                    size={256}
                                    style={{
                                        height: "auto",
                                        maxWidth: "100%",
                                        width: "100%",
                                    }}
                                    value={appInfo?.link || ""}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="v4-banner-download-app-12">
                    <figure style={customStyles} />
                </div>
            </div>
        </div>
    );
};
export default React.memo(DownloadApp);
