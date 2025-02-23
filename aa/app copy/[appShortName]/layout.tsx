import AppLayout from "@/components/appLayout";
import EventListener from "@/components/event";
import AppThemeProvider from "@/components/theme/themeProvider";
import InitializeDB from "@/components/initData/initializeDB";
import ServiceWorkerInit from "@/components/initData/sw";
import InitDataStore from "@/redux/initDataStore";
import { fetchAppData } from "@/utils/getAppInfos";
import replaceYear from "@/utils/replaceYear";
import type { Metadata } from "next";
import NotFound from "../not-found";
import InitPassing from "@/components/passing/initPassing";

type Props = {
    params: { appShortName: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { appShortName } = await params;
    if (!appShortName) {
        return {
            title: "Not Found",
            description: "Application not found",
        };
    }

    const { appInfo } = await fetchAppData(appShortName);

    if (!appInfo) {
        return {
            title: "Not Found",
            description: "Application not found",
        };
    }

    const image = `/infos/${appInfo.appShortName}/logo60.png`;

    return {
        title: replaceYear(appInfo.title),
        description: appInfo.descriptionSEO,
        keywords: appInfo.keywordSEO,
        icons: image,
        openGraph: {
            description: appInfo.descriptionSEO,
            title: replaceYear(appInfo.title),
            images: image,
        },
        twitter: {
            title: replaceYear(appInfo.title),
            description: appInfo.descriptionSEO,
            images: image,
        },
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { appShortName: string };
}) {
    const { appShortName } = await params;

    const { appInfo, appConfig } = await fetchAppData(appShortName, true);

    if (!appInfo || !appConfig) {
        return <NotFound />;
    }
    return (
        <main>
            <InitDataStore appConfig={appConfig} appInfo={appInfo} />
            <InitializeDB appInfo={appInfo} />
            <ServiceWorkerInit appInfo={appInfo} />
            <InitPassing />
            <AppThemeProvider>
                <AppLayout>{children}</AppLayout>
                <EventListener />
            </AppThemeProvider>
        </main>
    );
}
