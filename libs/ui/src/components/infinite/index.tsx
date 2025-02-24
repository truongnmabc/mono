import React, { Fragment, useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import Empty from "../empty";

type IProps<T> = {
    data: T[];
    getItemSize: (index: number) => number;
    item: (item: T) => React.ReactNode;
};

const VariableSizeList = <T,>({ data, getItemSize, item }: IProps<T>) => {
    const Row = ({
        index,
        style,
        data,
    }: {
        index: number;
        style: React.CSSProperties;
        data: T[];
    }) => {
        return (
            <div style={style} className="w-full py-2  h-full">
                {item(data[index])}
            </div>
        );
    };

    const pageRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const pageScroll = document.getElementById("pageScroll");
        if (pageScroll) {
            pageRef.current = pageScroll;
        }
    }, []);

    const outerRef = useRef<HTMLDivElement | null>(null);

    const isScroll = useRef(true);

    const handleScroll = ({
        scrollDirection,
        scrollOffset,
    }: {
        scrollDirection: "forward" | "backward";
        scrollOffset: number;
    }) => {
        // if (pageRef.current) {
        //     pageRef.current.style.overflow = "hidden";
        // }

        if (
            scrollDirection === "backward" &&
            scrollOffset === 0 &&
            pageRef.current
        ) {
            isScroll.current = false;
            // pageRef.current.style.overflow = "scroll";
            setTimeout(() => {
                isScroll.current = true;
            }, 50);
        }

        if (
            scrollDirection === "forward" &&
            outerRef.current &&
            scrollOffset + outerRef.current.offsetHeight ===
                outerRef.current.scrollHeight &&
            pageRef.current
        ) {
            isScroll.current = false;
            // pageRef.current.style.overflow = "scroll";
            setTimeout(() => {
                isScroll.current = true;
            }, 50);
        }
    };

    return (
        <Fragment>
            {data.length > 0 ? (
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            outerRef={outerRef}
                            height={height}
                            itemCount={data.length}
                            itemSize={getItemSize}
                            width={width}
                            itemData={data}
                            className="scrollbar-none"
                            onScroll={handleScroll}
                            style={{
                                overflow: isScroll.current ? "auto" : "hidden",
                            }}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            ) : (
                <Empty />
            )}
        </Fragment>
    );
};

export default VariableSizeList;
