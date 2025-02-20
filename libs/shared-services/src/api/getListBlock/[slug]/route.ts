import { requestGetData } from "@/services/request";
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params)?.slug;
    if (!slug) throw new Error("");

    try {
        const response = await requestGetData({
            url: `/wp-json/passemall/v1/get-post-by-category-name?category_name=${slug}`,
            config: {
                baseURL: "https://cdl-prep.com",
            },
        });
        if (response) {
            return Response.json({
                response,
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
