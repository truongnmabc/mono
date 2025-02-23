import { timeCaching } from "@/constants";
import { IAppInfo } from "@/models/app/appInfo";
import cache from "memory-cache";
import appInfos from "@/data/dynamic/appInfos.json"; // Import trực tiếp JSON

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params)?.slug;
    console.log("🚀 ~ slug:", slug);
    if (!slug) {
        return Response.json({
            error: "Missing 'slug' parameter",
            code: 400,
            status: 0,
        });
    }

    // Kiểm tra cache trước
    const cachingValue = cache.get(slug);
    if (cachingValue) {
        console.log("🚀 ~ Returning cached data for:", slug);
        return Response.json({
            data: cachingValue,
            code: 200,
            message: "Data from cache",
            status: 1,
        });
    }

    try {
        // Tìm kiếm thông tin app theo slug
        const currentAppInfo = appInfos.find(
            (appInfo) => appInfo.appShortName === slug
        ) as IAppInfo | undefined;

        if (currentAppInfo) {
            console.log("✅ Found app info for:", slug);
            cache.put(slug, currentAppInfo, timeCaching);
            return Response.json({
                data: currentAppInfo,
                code: 200,
                status: 1,
            });
        } else {
            console.log("❌ No app info found for:", slug);
            return Response.json({
                data: null,
                code: 404,
                message: "AppId not found",
                status: 0,
            });
        }
    } catch (error) {
        console.error("🚀 ~ Error processing request:", error);
        return Response.json({
            error: "Internal server error",
            code: 500,
            status: 0,
        });
    }
}
