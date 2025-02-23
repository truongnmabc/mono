"use client";
import { resetState } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import Grid2 from "@mui/material/Grid2";
import { useEffect } from "react";
import ReviewProvider from "./context";
import dynamic from "next/dynamic";
const MobileLayout = dynamic(() => import("./mobileLayout"), {
    ssr: false,
});
const PcLayout = dynamic(() => import("./pcLayout"), {
    ssr: false,
});

const ReviewView = ({
    contentSeo,
    isMobile,
}: {
    contentSeo?: string;
    isMobile: boolean;
}) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(resetState());
    }, [dispatch]);

    return (
        <div className="sm:py-4 h-full pb-4 " id="v4-study-main-view-0">
            <ReviewProvider>
                <Grid2
                    container
                    spacing={{ xs: 0, sm: 2 }}
                    className="w-full h-full"
                >
                    {isMobile ? (
                        <MobileLayout contentSeo={contentSeo} />
                    ) : (
                        <PcLayout contentSeo={contentSeo} />
                    )}
                </Grid2>
            </ReviewProvider>
        </div>
    );
};

export default ReviewView;
