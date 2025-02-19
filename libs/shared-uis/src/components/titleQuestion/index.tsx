"use client";
import { selectCurrentSubTopicIndex } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import clsx from "clsx";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useMemo, useRef } from "react";

export const getKeyTest = (
    pathname: string | string[] | undefined
): string | null => {
    if (!pathname) return null;
    if (typeof pathname === "string") {
        const name = pathname?.replace("-practice-test", "");
        return decodeURI(name.replaceAll("-", " ")?.replaceAll("_", " "));
    }
    return decodeURI(pathname[pathname?.length - 1]);
};

export const getLastPathSegment = (pathname?: string | null): string | null => {
    if (!pathname) {
        console.log("Pathname is empty");
        return null;
    }

    const segments = pathname?.split("/").filter(Boolean);

    const lastSegment =
        segments[segments.length - 1]?.replaceAll("_", " ") || null;

    return lastSegment;
};

const TitleQuestion = ({ type }: { type?: string }) => {
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const defaultTitle = useMemo(
        () => getKeyTest(params?.["slug"]) || getLastPathSegment(pathname),
        [params, pathname]
    );
    const index = useAppSelector(selectCurrentSubTopicIndex);
    const tempCountRef = useRef(0);

    const handleTesterMode = () => {
        const isTester = sessionStorage.getItem("isTester");

        if (isTester) {
            sessionStorage.removeItem("isTester");
            alert("By! Tester");
            router.back();
        } else {
            tempCountRef.current++;
            setTimeout(() => (tempCountRef.current = 0), 2000);

            if (tempCountRef.current >= 3) {
                alert("Hello! Tester");
                sessionStorage.setItem("isTester", "true");
                tempCountRef.current = 0;
                router.back();
            }
        }
    };
    return (
        <div
            className={clsx(
                "w-full text-center hidden sm:block capitalize text-xl font-semibold"
            )}
            onClick={handleTesterMode}
        >
            {defaultTitle} {type === "learn" ? `- Core ${index}` : ""}
        </div>
    );
};

export default React.memo(TitleQuestion);
