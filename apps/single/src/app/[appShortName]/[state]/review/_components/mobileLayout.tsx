import React, { Fragment, useContext } from "react";
import Grid2 from "@mui/material/Grid2";
import clsx from "clsx";
import ListReview from "./gridLeftReview/listReview";
import { ReviewContext } from "./context";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import SeoContent from "@/components/seoContent/seoContent";
import SheetSelectQuestions from "./sheet";
import dynamic from "next/dynamic";
import BottomLestTest from "./bottom";

const WeakQuestions = dynamic(() => import("./content/weak/weakMobile"), {
    ssr: false,
});

const SavedQuestions = dynamic(() => import("./content/saved/savedMobile"), {
    ssr: false,
});
const AllQuestions = dynamic(() => import("./content/all"), {
    ssr: false,
});
const RandomGameContent = dynamic(
    () => import("./content/random/randomGameContent"),
    {
        ssr: false,
    }
);

const MobileLayout = ({ contentSeo }: { contentSeo?: string }) => {
    const { isShowList, isStart, selectType } = useContext(ReviewContext);

    const componentMapping = {
        random: <RandomGameContent />,
        weak: <WeakQuestions />,
        hard: <RandomGameContent />,
        saved: <SavedQuestions />,
        all: <AllQuestions />,
    };

    return (
        <Fragment>
            {isShowList && (
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
                        <ListReview isMobile />
                    </div>
                </Grid2>
            )}
            {(isStart || !isShowList) && (
                <Grid2
                    size={{
                        sm: 9,
                        xs: 12,
                    }}
                >
                    <div className="w-full h-full flex flex-col pt-2 gap-4  sm:gap-6 ">
                        {componentMapping[selectType]}

                        <BannerDownloadApp />
                        {contentSeo && (
                            <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                                <SeoContent content={contentSeo} />
                            </div>
                        )}
                    </div>
                </Grid2>
            )}
            <BottomLestTest />
            <SheetSelectQuestions />
        </Fragment>
    );
};

export default MobileLayout;
