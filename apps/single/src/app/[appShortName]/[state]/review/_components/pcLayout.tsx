import { Grid2 } from "@mui/material";
import clsx from "clsx";
import React, { Fragment } from "react";
import AnswerReview from "./gridLeftReview/answer";
import ListReview from "./gridLeftReview/listReview";
import TitleReview from "./content/title";
import SeoContent from "@/components/seoContent/seoContent";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import ReviewContentGroup from "./content";
const PcLayout = ({ contentSeo }: { contentSeo?: string }) => {
    return (
        <Fragment>
            <Grid2
                size={{
                    sm: 3,
                    xs: 12,
                }}
                spacing={{
                    xs: 0,
                }}
            >
                <div className={clsx("flex flex-col gap-3")}>
                    <AnswerReview />
                    <ListReview isMobile={false} />
                </div>
            </Grid2>
            <Grid2
                size={{
                    sm: 9,
                    xs: 12,
                }}
            >
                <div className="w-full h-full flex flex-col gap-4 sm:gap-6 ">
                    <TitleReview />
                    <ReviewContentGroup isMobile={false} />
                    <BannerDownloadApp />
                    {contentSeo && (
                        <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                            <SeoContent content={contentSeo} />
                        </div>
                    )}
                </div>
            </Grid2>
        </Fragment>
    );
};
export default PcLayout;
