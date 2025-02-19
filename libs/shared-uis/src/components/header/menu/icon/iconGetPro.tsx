"use client";

import RouterApp from "@/constants/router.constant";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const FN = () => {
    return (
        <Link href={RouterApp.Get_pro}>
            <div className="hidden sm:flex item-center  capitalize gap-3">
                <div className="w-fit cursor-pointer h-fit">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.6992 18.9799H7.29922C6.87922 18.9799 6.40922 18.6499 6.26922 18.2499L2.12922 6.66986C1.53922 5.00986 2.22922 4.49986 3.64922 5.51986L7.54922 8.30986C8.19922 8.75986 8.93922 8.52986 9.21922 7.79986L10.9792 3.10986C11.5392 1.60986 12.4692 1.60986 13.0292 3.10986L14.7892 7.79986C15.0692 8.52986 15.8092 8.75986 16.4492 8.30986L20.1092 5.69986C21.6692 4.57986 22.4192 5.14986 21.7792 6.95986L17.7392 18.2699C17.5892 18.6499 17.1192 18.9799 16.6992 18.9799Z"
                            stroke="var(--text-color-primary)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6.5 22H17.5"
                            stroke="var(--text-color-primary)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9.5 14H14.5"
                            stroke="var(--text-color-primary)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div
                    className={clsx(
                        "text-base font-normal cursor-pointer text-100   underline decoration-current main-color underline-offset-2"
                    )}
                >
                    Get pro
                </div>
            </div>
        </Link>
    );
};
const IconGetPro = React.memo(FN);
export default IconGetPro;
