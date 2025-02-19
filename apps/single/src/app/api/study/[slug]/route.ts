import { BASE_STORE_URL } from "@/constants";
import { requestGetData } from "@/services/request";

// *NOTE : khong bo api nay
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    console.log("🚀 ~ slug:", slug);

    try {
        const data = await requestGetData({
            url: `/${slug}/web-data/all-data.json?t=${new Date().getTime()}`,
            config: {
                baseURL: BASE_STORE_URL,
            },
        });
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
