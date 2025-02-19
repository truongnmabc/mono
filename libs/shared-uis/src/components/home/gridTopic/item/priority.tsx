"use client";
import RouterApp from "@/constants/router.constant";
import MtUiSkeleton from "@/components/loading-skeleton";
import { convertPathName } from "@/utils/pathName";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

const Priority = ({ priority, name }: { priority: number; name: string }) => {
    const pathname = usePathname();
    const [currentPathname, setCurrentPathname] = useState(pathname);

    useEffect(() => {
        const path = convertPathName(pathname);
        setCurrentPathname(path || "");
    }, [pathname]);

    return (
        <Fragment>
            {priority == 1 && (
                <h1
                    className={clsx(
                        "pl-3 pr-2 text-xs flex-1 truncate font-medium",
                        {
                            "sm:text-lg text-base":
                                currentPathname === RouterApp.Home,
                        }
                    )}
                >
                    {name ? name : <MtUiSkeleton className="min-h-6 " />}
                </h1>
            )}
            {priority == 2 && (
                <h2
                    className={clsx(
                        "text-xs  pr-2 pl-3 flex-1 truncate font-medium",
                        {
                            "sm:text-lg text-base":
                                currentPathname === RouterApp.Home,
                        }
                    )}
                >
                    {name ? name : <MtUiSkeleton className="min-h-6 " />}
                </h2>
            )}
            {priority == 3 && (
                <h3
                    className={clsx(" pl-3  pr-2 flex-1 truncate font-medium", {
                        "sm:text-lg text-base":
                            currentPathname === RouterApp.Home,
                        "text-xs": currentPathname !== RouterApp.Home,
                    })}
                >
                    {name ? name : <MtUiSkeleton className="min-h-6 " />}
                </h3>
            )}
            {priority == 4 && (
                <h4
                    className={clsx(
                        "text-xs pl-3  pr-2 flex-1 truncate font-medium",
                        {
                            "sm:text-lg text-base":
                                currentPathname === RouterApp.Home,
                        }
                    )}
                >
                    {name ? name : <MtUiSkeleton className="min-h-6 " />}
                </h4>
            )}
        </Fragment>
    );
};

export default Priority;
