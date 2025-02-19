import ReviewView from "@/app/[appShortName]/[state]/review/_components";
import MyContainer from "@/components/container";
import { requestGetTitleSeoPage } from "@/services/titleSeo.service";
import { detectAgent } from "@/utils/detectDevice";
import { headers } from "next/headers";

export default async function Page() {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const isMobile = detectAgent(userAgent || "");
    const { content } = await requestGetTitleSeoPage("review");

    return (
        <MyContainer className="h-full sm:py-0">
            <ReviewView isMobile={isMobile} contentSeo={content} />
        </MyContainer>
    );
}
