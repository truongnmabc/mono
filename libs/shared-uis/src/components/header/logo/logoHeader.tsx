"use client";
import LazyLoadImage from "@/components/images";
import { useTheme } from "@/hooks/useTheme";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import RouterApp from "@/constants/router.constant";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
const FN = () => {
    const { push } = useRouter();
    const pathname = usePathname() || "";
    const { theme } = useTheme();
    const appInfo = useAppSelector(selectAppInfo);
    return (
        <div
            className="h-full max-h-10 w-full flex items-center cursor-pointer"
            onClick={() => {
                if (pathname === RouterApp.Home) return;
                push(RouterApp.Home);
            }}
            data-testid="logoHeader"
        >
            <LazyLoadImage
                src={`/${appInfo.appShortName}/logo/${
                    theme == "dark" ? "logo-dark" : "logo-light"
                }.png`}
                alt="logoHeader"
                classNames=" w-full max-w-[128px] max-h-14 min-h-[40px] sm:max-w-[160px]"
            />
        </div>
    );
};
const LogoHeader = React.memo(FN);
export default LogoHeader;
