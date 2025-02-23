import { requestGetData } from "@/services/request";
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params)?.slug;
    if (!slug) throw new Error("");

    try {
        const data = await requestGetData({
            url: `asvab/web-data/exam-${slug}.json`,
            config: {
                baseURL:
                    "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            },
        });
        if (data) {
            return Response.json({
                data,
            });
        } else {
            return Response.json({
                data: "",
                code: 404,
                message: "AppId not founds",
                status: 0,
            });
        }
    } catch (error) {
        console.log("🚀 ~ error:", error);
        return Response.json({ error: "Failed to read appInfos.json" });
    }
}
