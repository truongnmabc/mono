import clsx from "clsx";
import React from "react";
import "./index.css";
import { ISkeletonProps } from "./type";
const MtUiSkeleton: React.FC<ISkeletonProps> = (props) => {
    const {
        className,
        circle = false,
        style,
        borderRadius = 8,
        enableAnimation,
        width,
        height,
    } = props;
    const prefix = "mtui-loading-skeleton";
    const classes = clsx(
        prefix,
        {
            [`${prefix}-circle`]: circle,
        },
        className
    );
    return (
        <span
            className={classes}
            style={{
                borderRadius: borderRadius,
                width: width,
                height: height,
                ...style,
            }}
            aria-live="polite"
            aria-busy={enableAnimation}
        ></span>
    );
};

export default MtUiSkeleton;
