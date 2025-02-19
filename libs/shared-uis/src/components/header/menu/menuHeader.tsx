"use client";
import React, { Fragment } from "react";
import IconGetPro from "./icon/iconGetPro";
import IconMenuHeader from "./icon/iconMenuHeader";
import IconTopics from "./icon/iconTopics";
import LoginHeader from "./icon/iconLogin";
import IconReviewHeader from "./icon/iconReview";
export interface IItemMenuHeader {
    name: string;
    icon?: React.ReactNode;
}

const menus: IItemMenuHeader[] = [
    {
        name: "Get Pro",
        icon: <IconGetPro />,
    },
    {
        name: "Topics",
        icon: <IconTopics />,
    },
    {
        name: "Review",
        icon: <IconReviewHeader />,
    },
    {
        name: "Log in",
        icon: <LoginHeader />,
    },
    {
        name: "Menu",
        icon: <IconMenuHeader />,
    },
];

const MenuHeaderDesktop = () => {
    return (
        <div className="flex gap-4 md:gap-9 items-center justify-end">
            {menus?.map((item) => (
                <Fragment key={item.name}>{item.icon}</Fragment>
            ))}
        </div>
    );
};

export default MenuHeaderDesktop;
