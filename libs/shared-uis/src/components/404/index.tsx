"use client";

import React from "react";
import "./index.css";
import ImagesRender from "./imagesRender";
import { useRouter } from "next/navigation";

const Page404Container = () => {
    const router = useRouter();
    return (
        <div className="page-404-container">
            <div className="main-page">
                <ImagesRender
                    name="number404"
                    size={{
                        width: 499,
                        height: 277,
                    }}
                    mobileSize={{
                        width: 287,
                        height: 131,
                    }}
                />

                <div className="page-not-found-text">Oops! Page not found.</div>
                <div className="sorry-text">
                    Sorry, the page you&apos;re looking for doesn&apos;t exist.
                </div>
                <div
                    onClick={() => {
                        router.back();
                    }}
                    className="button-back"
                >
                    Back to Home
                </div>
            </div>
            <ImagesRender
                name="soldier"
                size={{
                    width: 508,
                    height: 657,
                }}
                mobileSize={{
                    width: 192,
                    height: 246,
                }}
            />
        </div>
    );
};

export default Page404Container;
