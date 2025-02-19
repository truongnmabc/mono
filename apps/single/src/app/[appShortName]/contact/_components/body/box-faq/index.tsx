import React, { useCallback, useEffect, useRef, useState } from "react";
import { IFAQData } from "..";
import "./index.scss";
import { useMediaQuery } from "@mui/material";
import LazyLoadImage from "@/components/images";

const BoxFAQComponent = ({
    index,
    data,
}: {
    index: number;
    data: IFAQData;
}) => {
    const notIsMobile = useMediaQuery("(min-width: 600px)");
    const contactBoxRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean | null>(null);
    const statusIcon = open ? "plus" : "plus";
    const srcStatusIcon = notIsMobile ? "" : "/mobile";

    const handleToggleOpen = useCallback(
        (status?: boolean) => {
            if (contactBoxRef.current) {
                const contentMinHeight = notIsMobile ? "104px" : "70px";
                const contentMaxHeight = `${contactBoxRef.current.scrollHeight}px`;

                contactBoxRef.current.style.setProperty(
                    "--min-height-box",
                    contentMinHeight
                );
                contactBoxRef.current.style.setProperty(
                    "--max-height-box",
                    contentMaxHeight
                );

                const nextStatus = status ?? !open;
                if (nextStatus !== open) {
                    setOpen(nextStatus);
                }
            }
        },
        [notIsMobile, open]
    );

    useEffect(() => {
        /* Mặc định mở qa đầu tiên */
        if (index === 0) {
            handleToggleOpen(true);
        }
    }, [index, handleToggleOpen]);

    const getAnimBox = () => {
        if (open !== null) {
            /* Tránh th mới vào trang dính anim đóng box */
            if (!!open) {
                return "open";
            } else {
                return "close";
            }
        }
        return "";
    };

    return (
        <div
            ref={contactBoxRef}
            className={"contact-box-faq-component " + getAnimBox()}
            onClick={() => handleToggleOpen()}
        >
            <div className="question">
                <div className="index">{`0${index + 1}`}</div>
                <div className="question">{data.question}</div>
                <div className={"status-icon " + (!!open ? "open" : "close")}>
                    <LazyLoadImage
                        src={`/images/contacts${srcStatusIcon}/${statusIcon}.png`}
                        alt={statusIcon}
                    />
                </div>
            </div>
            <div className="answer">{data.answer}</div>
        </div>
    );
};

export default BoxFAQComponent;
