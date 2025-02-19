import StoreProvider from "@/app/StoreProvider";
import "@/css/globals.css";
import { getAppInfoParentApp } from "@/utils/getAppInfos";
import replaceYear from "@/utils/replaceYear";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Poppins, Vampiro_One } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

const vampiro = Vampiro_One({
    weight: ["400"],
    style: "normal",
    preload: true,
    display: "swap",
    variable: "--font-vampiro",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    style: "normal",
    preload: true,
    display: "swap",
    variable: "--font-poppins",
    subsets: ["latin"],
});

export async function generateMetadata() {
    if (!process.env.IS_SINGLE_APP) {
        const { appInfo } = getAppInfoParentApp();

        if (appInfo) {
            const image = `/infos/${appInfo?.appShortName}/logo60.png`;
            return {
                metadataBase: new URL("http://localhost:3000/"),
                title: replaceYear(appInfo.title),
                description: appInfo.descriptionSEO,
                keywords: appInfo.keywordSEO,
                icons: image,
                openGraph: {
                    description: appInfo.descriptionSEO,
                    title: appInfo.title,
                    images: image,
                },
            };
        }
    }
    return null;
}

export default function ParentAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { appInfo } = getAppInfoParentApp();
    return (
        <html
            lang="en"
            className={`${vampiro?.variable} ${poppins?.variable} font-sans`}
        >
            <Head>
                <Link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <StoreProvider appInfo={appInfo}>{children}</StoreProvider>
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
                {process.env.NEXT_PUBLIC_GTM_ID && (
                    <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
                )}
            </body>

            <Script src="https://accounts.google.com/gsi/client" async defer />
            <Script
                src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
                async
                defer
            />
        </html>
    );
}
