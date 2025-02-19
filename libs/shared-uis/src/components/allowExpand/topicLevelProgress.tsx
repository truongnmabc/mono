"use client";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { selectSubTopicsId } from "@/redux/features/study.reselect";
import { useAppSelector } from "@/redux/hooks";
import { groupTopics } from "@/utils/math";
import clsx from "clsx";
import React, { Fragment, useEffect, useRef } from "react";
import IconProgress from "./iconProgress";

type CenterPosition = {
    x: number;
    y: number;
};

const drawCurvedLine = (
    start: CenterPosition,
    end: CenterPosition,
    ctx: CanvasRenderingContext2D | null,
    isRight: boolean
) => {
    if (!ctx) return;

    const centerX = (start.x + end.x) / 2 + (isRight ? 20 : -20);
    const centerY = (start.y + end.y) / 2;
    const radius = Math.abs(end.y - start.y) / 2;

    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        radius,
        isRight ? (3 * Math.PI) / 2 : Math.PI / 2,
        isRight ? Math.PI / 2 : (3 * Math.PI) / 2,
        false
    );
    ctx.strokeStyle = "#2121213D";
    ctx.stroke();
};

function getCenterPosition(
    element: HTMLDivElement,
    container: HTMLDivElement | null
): CenterPosition {
    const rect = element.getBoundingClientRect();
    if (container) {
        const containerRect = container.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top,
        };
    }
    return { x: 0, y: 0 };
}

const TopicLevelProgress = ({ subTopic }: { subTopic: ITopicBase }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const selectedSubTopics = useAppSelector(selectSubTopicsId);
    const isExpand = selectedSubTopics === subTopic.id;

    useEffect(() => {
        if (!isExpand || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const icons =
            container.querySelectorAll<HTMLDivElement>(".iconDrawCanvas");

        ctx.strokeStyle = "#2121213D";
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 10]);

        for (let i = 0; i < icons.length - 1; i++) {
            const start = getCenterPosition(icons[i], container);
            const end = getCenterPosition(icons[i + 1], container);
            if (start.y === end.y) {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            } else {
                const position = i % 2 === 0;
                drawCurvedLine(start, end, ctx, position);
            }
        }

        return () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [isExpand]);

    const arr = groupTopics(subTopic?.topics || [], 3);

    return (
        <div
            ref={containerRef}
            className={clsx(
                "w-full h-full relative bg-[#F3F5F6] py-2 justify-center rounded-b-md transition-all",
                {
                    flex: isExpand,
                    hidden: !isExpand,
                }
            )}
            id={`container-${subTopic.id}`}
        >
            <div className="flex flex-wrap gap-2 w-[200px]">
                <Wrapper data={arr} />
            </div>
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full top-0 left-0 z-0"
            />
        </div>
    );
};

const Wrapper = ({ data }: { data: { id: number; value: ITopicBase[] }[] }) => {
    const readySubTopic = data
        .flatMap((group) => group.value)
        .find((item) => item.status === 0);

    return (
        <Fragment>
            {data.map((line, index) => (
                <div
                    className={clsx(
                        "flex w-[200px] relative transition-all flex-wrap gap-4",
                        {
                            "justify-center": index === 0,
                            "justify-start": index % 2 === 0,
                            "flex-row-reverse": index % 2 === 1,
                        }
                    )}
                    key={index}
                >
                    {line.value.map((part, i) => (
                        <IconProgress
                            part={part}
                            index={index * 3 + i + 1}
                            key={i}
                            readySubTopic={readySubTopic}
                            isPass={part.status === 1}
                        />
                    ))}
                </div>
            ))}
        </Fragment>
    );
};

export default React.memo(TopicLevelProgress);
