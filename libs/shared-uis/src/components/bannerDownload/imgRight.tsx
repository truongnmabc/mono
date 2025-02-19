import React from "react";
import LazyLoadImage from "@/components/images";

const ImgRightBannerApp = () => {
    return (
        <div className=" relative overflow-hidden w-[343px] h-full">
            <LazyLoadImage
                imgClassNames=" object-cover "
                src="/asvab/banner/bgBannerApp.png"
            />
            <LazyLoadImage
                classNames=" absolute top-0 z-10 left-[64px] "
                src="/asvab/banner/bgLeftBanner.png"
            />
            <LazyLoadImage
                classNames=" absolute top-0 left-[124px] "
                src="/asvab/banner/bgRightBanner.png"
            />
        </div>
    );
};

export default ImgRightBannerApp;
