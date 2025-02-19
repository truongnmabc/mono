import React from "react";
import AboutUsContainer from "@/app/[appShortName]/about-us/_components";
import { fetchAppData } from "@/utils/getAppInfos";
type Params = {
    params: Promise<{ appShortName: string; slug: string }>;
};
export default async function Page({ params }: Params) {
    const { appShortName } = await params;

    const { appInfo } = await fetchAppData(appShortName);

    if (!appInfo) {
        throw new Error("App info not found");
    }
    return <AboutUsContainer appInfo={appInfo} />;
}
