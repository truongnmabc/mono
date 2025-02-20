import { requestGetData } from "@/services/request";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;

  try {
    const data = await requestGetData({
      url: `/asvab/web-data/topic-${slug}.json?t=${new Date().getTime()}`,
      config: {
        baseURL:
          "https://storage.googleapis.com/micro-enigma-235001.appspot.com",
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
