import { RouterApp } from "@shared-constants";

export const convertPathName = (pathName: string): string => {
    const isSingleApp = process.env["IS_SINGLE_APP"] === "true";

    if (isSingleApp) return pathName;

    const pathParts = pathName.split("/").filter(Boolean);

    return pathParts.length > 1 ? `/${pathParts.slice(1).join("/")}` : "/";
};

const listAppNotState = ["getPro", "about-us", "contact", "billing"];

export const revertPathName = ({
    href,
    appName,
    state,
}: {
    href?: string;
    appName: string;
    state?: string;
}): string => {
    const isSingleApp = process.env["IS_SINGLE_APP"] === "true";
    if (isSingleApp && href) return href;

    if (href && listAppNotState.includes(href)) return `/${appName}/${href}`;
    if (href === RouterApp.Home) return `/${appName}`;

    if (!href) return state ? `/${appName}/${state}` : `/${appName}`;

    return `/${appName}/${state || "all"}/${href}`;
};
