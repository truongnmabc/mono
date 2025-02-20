import { timeCaching } from "@/constants";
import { requestGetData } from "@/services/request";
import cache from "memory-cache";
import { NextRequest } from "next/server";
export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ slug: string }>;
    }
) {
    const { nextUrl } = request;
    const search = nextUrl.searchParams.get("search");
    const type = nextUrl.searchParams.get("type");

    const slug = (await params).slug;

    const state = type && type === "final_test" ? search : `${slug}-${search}`;

    if (process.env.NODE_ENV === "development") {
        return Response.json({
            data: "",
            code: 404,
            message: "data not founds",
            status: 0,
        });
    }
    try {
        const cachingValue = cache.get(state);
        if (cachingValue) {
            return Response.json({
                data: cachingValue,
                code: 200,
                message: "data caching",
                status: 1,
            });
        }

        const data = (await requestGetData({
            url: `/wp-json/passemall/v1/get-info-state?stateSlug=${state}`,
            config: {
                baseURL: "https://api.asvab-prep.com",
            },
        })) as {
            content: string;
        };

        const currentAppInfo = {
            content: data?.content,
        };
        if (data) {
            cache.put(state, currentAppInfo, timeCaching);

            return Response.json({
                data: currentAppInfo,
                code: 200,
                status: 1,
            });
        } else {
            return Response.json({
                data: "",
                code: 404,
                message: "data not founds",
                status: 0,
            });
        }
    } catch (error) {
        console.log("🚀 ~ error:", error);
        return Response.json({ error: "Failed to read appInfos.json" });
    }
}
