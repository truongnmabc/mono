import LoadingPage from "@/app/loading";
import ctx from "@/utils/mergeClass";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";
import { parseThreshold, ThresholdUnits } from "./utils/threshold";
import clsx from "clsx";

interface IInfinityProps {
    children: React.ReactNode;
    fetchNextPage: (page: number) => void;
    isFetchingNextPage?: boolean;
    total?: number;
    dataLength?: number;
    isSuccess?: boolean;
    isLoading?: boolean;
    classNames?: string;
    styles?: CSSProperties;
    isScrollPage?: boolean;
    pageScrollId?: string;
}
const Infinity: React.FC<IInfinityProps> = (props) => {
    const {
        fetchNextPage,
        isFetchingNextPage,
        children,
        total,
        dataLength,
        isSuccess,
        isLoading,
        classNames,
        styles,
        isScrollPage = false,
        pageScrollId,
    } = props;

    const divRef = useRef<HTMLDivElement | null>(null);
    const actionTriggered = useRef(false);
    const [isFetching, setIsFetching] = useState(false);
    const isElementAtBottom = (
        target: HTMLElement,
        scrollThreshold: string | number = 0.6
    ) => {
        const clientHeight = target.clientHeight;
        const threshold = parseThreshold(scrollThreshold);
        if (threshold.unit === ThresholdUnits.Pixel) {
            return (
                target.scrollTop + clientHeight >=
                target.scrollHeight - threshold.value
            );
        }
        return (
            target.scrollTop + clientHeight >=
            (threshold.value / 100) * target.scrollHeight
        );
    };
    const startPage = useRef(0);

    const onScrollListener = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const atBottom = isElementAtBottom(target as HTMLElement);
        if (actionTriggered.current) return;

        if (atBottom) {
            actionTriggered.current = true;
            setIsFetching(true);
            startPage.current++;
            fetchNextPage(startPage.current);
        }
    };

    const throttledOnScrollListener = useRef(
        throttle(250, onScrollListener).bind({}) as (e: MouseEvent) => void
    );
    useEffect(() => {
        if (isScrollPage && pageScrollId) {
            const page = document.getElementById(pageScrollId);
            if (page) {
                page.addEventListener(
                    "scroll",
                    throttledOnScrollListener.current as unknown as EventListenerOrEventListenerObject
                );
            }
            return;
        }
        if (divRef.current) {
            divRef.current.addEventListener(
                "scroll",
                throttledOnScrollListener.current as unknown as EventListenerOrEventListenerObject
            );
        }
    }, [isScrollPage, pageScrollId]);
    useEffect(() => {
        if (!isFetchingNextPage) {
            actionTriggered.current = false;
            setIsFetching(false);
        }
    }, [actionTriggered, isFetchingNextPage]);

    return (
        <div
            className={ctx(
                clsx("w-full h-full ", {
                    "overflow-y-auto scroll-smooth": !isScrollPage,
                }),
                classNames
            )}
            ref={divRef}
            style={styles}
        >
            {isLoading && dataLength === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                    <LoadingPage />
                </div>
            )}
            {children}
            {isSuccess && dataLength === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                    Empty
                </div>
            )}
            {isFetching && dataLength !== total && (
                <div className="w-full h-12 flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-t-transparent border-l-[#21212180] border-solid border-r-[#21212180] border-b-[#21212180] rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};
const MtUIInfinity = React.memo(Infinity);
export default MtUIInfinity;
