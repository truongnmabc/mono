"use client";
import React, { ForwardRefRenderFunction, useEffect, useState } from "react";
import clsx from "clsx";
import { BaseButtonProps } from "./type";
import MtUiRipple, { useRipple } from "@/components/ripple";
import MtUiLSpinningBubbles from "@/components/loading";
import ctx from "@/utils/mergeClass";
const BtnComponent: ForwardRefRenderFunction<
    HTMLButtonElement,
    BaseButtonProps
> = (props, forwardedRef) => {
    const {
        loading = false,
        disabled = false,
        onClick,
        children,
        type = "default",
        style,
        className,
        icon,
        iconPosition = "start",
        shape,
        htmlType,
        size = "middle",
        block,
        animated = true,
    } = props;

    const prefixCls = "mtui-btn";
    const [isLoading, setIsLoading] = useState(loading);

    const ref = forwardedRef as React.RefObject<HTMLButtonElement>;
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        if (loading && typeof loading === "object" && loading.delay) {
            timeout = setTimeout(() => {
                setIsLoading(false);
            }, loading.delay);
        } else {
            setIsLoading(!!loading);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [loading]);
    let content = children;
    const defaultClass = clsx(
        prefixCls,
        {
            "px-3 py-1 text-xs rounded-lg ":
                size === "small" && shape !== "circle",
            "px-[18px] py-[6px] text-sm rounded-lg":
                size === "middle" && shape !== "circle",
            "px-6 py-2 text-base rounded-lg":
                size === "large" && shape !== "circle",
            [prefixCls + "-share-circle"]: shape === "circle",
            [prefixCls + "-loading"]: isLoading,
            "pointer-events-none": isLoading,
            [prefixCls + "-icon"]: icon || loading,
            "w-full": block,
        },
        `${prefixCls}-type-${type}`,

        `${prefixCls}-${size}`,
        "border border-solid border-[#d9d9d9]  mt-shadow-small"
    );
    if (shape && shape === "circle" && typeof content === "string") {
        const newContent = content.slice(0, 1);
        content = newContent;
    }
    const classes = ctx(defaultClass, className);
    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        if (animated) {
            onRippleClickHandler(e);
        }
        if (onClick) {
            onClick(e);
        }
    };
    return (
        <button
            ref={ref}
            onClick={handleClick}
            type={htmlType}
            style={style}
            disabled={disabled}
            className={classes}
        >
            {animated && (
                <MtUiRipple ripples={ripples} onClear={onClearRipple} />
            )}

            {((icon && iconPosition === "start") ||
                (iconPosition === "start" && isLoading)) && (
                <div className="mtui-btn-item-icon">
                    {icon ? (
                        icon
                    ) : loading ? (
                        <MtUiLSpinningBubbles
                            color="#ccc"
                            width={16}
                            height={16}
                        />
                    ) : null}
                </div>
            )}

            {content}
            {((icon && iconPosition === "end") ||
                (isLoading && iconPosition === "end")) && (
                <div className="mtui-btn-item-icon ">
                    {icon ? (
                        icon
                    ) : loading ? (
                        <MtUiLSpinningBubbles
                            color="#ccc"
                            width={16}
                            height={16}
                        />
                    ) : null}
                </div>
            )}
        </button>
    );
};

const MtUiButton = React.forwardRef(BtnComponent);

export default MtUiButton;
