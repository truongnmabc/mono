import MyContainer from "@/components/container";
import GridTest from "@/components/home/gridTests/gridTestHome";
import GridTopics from "@/components/home/gridTopic/gridTopics";
import TitleHomeApp from "@/components/home/title";
import SeoContent from "@/components/seoContent/seoContent";
import HomeSingleApp from "@/components/state-app";
import { fetchAppDataHomePage } from "@/services/homeData.service";
import { detectAgent } from "@/utils/detectDevice";
import { getAppType } from "@/utils/web";
import dynamic from "next/dynamic";
import { headers } from "next/headers";

const BannerHome = dynamic(
    () => import("@/components/state-app/newHome/banner/index")
);
type Params = {
    params: Promise<{ appShortName: string }>;
};

export default async function Home({ params }: Params) {
    try {
        const appShortName = (await params)?.appShortName;
        const headersList = await headers();
        const userAgent = headersList.get("user-agent");
        const isMobile = detectAgent(userAgent || "");
        const appType = getAppType(appShortName);

        const { appInfos, contentSeo, topics } = await fetchAppDataHomePage(
            appShortName
        );

        if (!appInfos) return;

        if (appType === "default") {
            return (
                <MyContainer>
                    <TitleHomeApp appInfo={appInfos} />
                    <GridTopics
                        isMobile={isMobile}
                        topics={topics}
                        appInfo={appInfos}
                    />
                    <GridTest />
                    <div className="sm:my-[48px] sm:mb-[120px] my-[24px] mb-[48px]">
                        <BannerHome appInfo={appInfos} isHomePage={true} />
                    </div>
                    {contentSeo && (
                        <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                            <SeoContent content={contentSeo} />
                        </div>
                    )}
                </MyContainer>
            );
        }

        if (appType === "state") {
            return (
                <section className="w-full h-full  pb-12 sm:pb-6 ">
                    <HomeSingleApp appInfo={appInfos} />
                </section>
            );
        }
        return null;
    } catch (error) {
        console.log("🚀 ~ Home ~ error:", error);
        return (
            <section className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-lg text-gray-600">
                        Unable to load content. Please try again later.
                    </p>
                </div>
            </section>
        );
    }
}
