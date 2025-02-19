import { requestGetTitleSeoPage } from "@/services/titleSeo.service";
import FinalTestLayout from "./_components";

export default async function FinalTestPage() {
    const { content } = await requestGetTitleSeoPage("final_test");

    return <FinalTestLayout contentSeo={content} />;
}
