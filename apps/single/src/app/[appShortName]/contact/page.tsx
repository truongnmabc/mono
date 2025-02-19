import { fetchAppData } from "@/utils/getAppInfos";

type Params = {
    params: Promise<{ appShortName: string; slug: string }>;
};
import type { Metadata } from "next";
import ContactsScreen from "./_components";

export const metadata: Metadata = {
    title: "Contact us – ABC Elearning",
    description: "...",
};
const Page = async ({ params }: Params) => {
    const { appShortName } = await params;

    const { appInfo } = await fetchAppData(appShortName);

    if (!appInfo) {
        throw new Error("App info not found");
    }

    return <ContactsScreen appInfo={appInfo} />;
};

export default Page;
