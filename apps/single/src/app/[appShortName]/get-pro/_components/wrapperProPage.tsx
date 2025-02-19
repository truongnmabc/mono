"use client";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import ReviewPanelV2 from "./reviewPanel";
import axiosInstance from "@/config/axios";
import { API_PATH } from "@/constants/api.constants";
import { useState } from "react";
import MtUIInfinity from "@/components/infiniteScroller";

export interface IReview {
    id: number;
    title: string;
    content: string;
    author: string;
    lastUpdate: string;
    rating: number;
    platform: string;
    app: number;
    category: string;
    color?: string;
}

const paginateData = (data: IReview[], limit: number) => {
    const paginatedArray = [];
    for (let i = 0; i < data.length; i += limit) {
        paginatedArray.push(data.slice(i, i + limit));
    }
    return paginatedArray;
};
const WrapperProPage = ({ children }: { children: React.ReactNode }) => {
    const { appInfo } = useAppSelector(appInfoState);
    const [allReviews, setAllReviews] = useState<IReview[][]>([]);
    const [currentReviews, setCurrentReviews] = useState<IReview[]>([]);
    const [page, setPage] = useState(0);
    const [limit] = useState(20);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    useEffect(() => {
        const getAppReviews = async () => {
            if (appInfo.appId) {
                const res = await axiosInstance.get(
                    `${API_PATH.GET_APP_REVIEW}/${appInfo.appId}`
                );

                const randomColorList = [
                    "#666444",
                    "#F1EFD8",
                    "#767462",
                    "#3A3523",
                    "#505130",
                    "#252F14",
                ];
                const mixArr = res?.data?.data?.reviews?.map(
                    (item: IReview) => ({
                        ...item,
                        color: randomColorList[
                            Math.floor(Math.random() * (6 - 0)) + 0
                        ],
                    })
                );
                if (mixArr) {
                    const newList = paginateData(mixArr, limit);
                    setAllReviews(newList);

                    setCurrentReviews(newList[0]);
                }
            }
        };
        getAppReviews();
    }, [appInfo.appId, limit]);

    useEffect(() => {
        if (page > 0 && allReviews.length) {
            const nextData = allReviews[page];
            setCurrentReviews((prev) => [...prev, ...nextData]);
            setIsFetchingNextPage(false);
        }
    }, [page, allReviews]);

    const fetchNextPage = (page: number) => {
        setPage(page);
        setIsFetchingNextPage(true);
    };

    return (
        <MtUIInfinity
            fetchNextPage={fetchNextPage}
            total={allReviews?.length}
            dataLength={currentReviews?.length}
            isScrollPage={true}
            pageScrollId="pageScroll"
            isFetchingNextPage={isFetchingNextPage}
            classNames="bg-white"
        >
            {children}
            <div className="max-w-page mx-auto bg-white w-full">
                <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-center">
                    What our users are saying
                </h2>
                <p className="px-4 text-[#705e57] text-center mt-6 text-base">
                    Over 50,000 aspiring American candidates use{" "}
                    {appInfo.appName} monthly
                </p>
            </div>
            <ReviewPanelV2 currentReviews={currentReviews} />
        </MtUIInfinity>
    );
};

export default WrapperProPage;
