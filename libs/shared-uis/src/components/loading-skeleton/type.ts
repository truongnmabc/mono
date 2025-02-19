import { CSSProperties } from "react";

type StyleOptions = {
    baseColor?: string;
    highlightColor?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    circle?: boolean;
    duration?: number;
    enableAnimation?: boolean;
};
export interface ISkeletonProps extends StyleOptions {
    count?: number;
    className?: string;
    style?: CSSProperties;
}
