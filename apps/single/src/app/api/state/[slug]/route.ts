import { timeCaching } from "@/constants";
import { requestGetData } from "@/services/request";
import cache from "memory-cache";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;

    const { nextUrl } = request;

    const state = nextUrl.searchParams.get("state");

    const cachingValue = cache.get(slug + "state");

    if (cachingValue) {
        return Response.json({
            data: cachingValue,
            code: 200,
            message: "data caching",
            status: 1,
        });
    }

    try {
        const data = await requestGetData({
            url: `new-data-web/${
                slug + "_v2"
            }/${state}/topics-and-tests.json?t=${new Date().getTime()}`,
            config: {
                baseURL:
                    "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            },
        });

        cache.put(slug + "state", data, timeCaching);

        return Response.json({
            data: data,
            code: 200,
            status: 1,
        });
    } catch (error) {
        console.log("🚀 ~ error:", error);
        return Response.json({ error: "Failed to read appInfos.json" });
    }
}
