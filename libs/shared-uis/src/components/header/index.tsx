"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { convertPathName } from "@/utils/pathName";
import { Grid2 } from "@mui/material";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React from "react";
import DownLoadApp from "./download/downloadApp";
import LogoHeader from "./logo/logoHeader";
import MenuHeader from "./menu/menuHeader";

export const listPageNotHeader = [
    "/study",
    "/diagnostic_test",
    "/final_test",
    "/custom_test",
];

const isPathInList = (path: string, list: string[]) => {
    return list.some((item) => path.includes(item));
};

const HeaderApp = () => {
    const pathname = usePathname() || "";
    const path = convertPathName(pathname);
    const isMobile = useIsMobile();

    return (
        <div className="w-full">
            <DownLoadApp />
            {isMobile && isPathInList(path || "", listPageNotHeader) ? null : (
                <div
                    className={clsx(
                        " h-fit w-full flex bg-white dark:bg-black border-b  border-[#e4e4e4] border-solid  justify-center "
                    )}
                    id="headerRootLayout"
                >
                    <div className="py-2 w-full z-0 h-full max-w-page">
                        <Grid2 container>
                            <Grid2
                                size={{
                                    xs: 8,
                                    sm: 4,
                                    md: 4,
                                }}
                            >
                                <LogoHeader />
                            </Grid2>
                            <Grid2
                                size={{
                                    xs: 4,
                                    sm: 8,
                                    md: 8,
                                }}
                            >
                                <MenuHeader />
                            </Grid2>
                        </Grid2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(HeaderApp);
