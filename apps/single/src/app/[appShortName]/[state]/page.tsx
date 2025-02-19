import axiosInstance from "@/config/axios";
import { listAppState } from "@/constants";
import { API_PATH } from "@/constants/api.constants";
import NewHome from "@/components/state-app/newHome";
import { ITestInfo } from "@/models/tests/tests";
import { getSEOAndHeaderContentApi } from "@/services/home.service";
import { fetchAppData } from "@/utils/getAppInfos";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ITopicBase } from "@/models/topics/topicsProgress";

type Props = {
    params: Promise<{ appShortName: string; state: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { state } = await params;

    const response = await getSEOAndHeaderContentApi(false, state, true);

    return {
        title: response?.titleSEO,
        description: response?.descriptionSEO,
        keywords: response?.keywordSEO,
    };
}

type Params = {
    params: Promise<{ appShortName: string; state: string }>;
};

type IRes = {
    fullTests: ITestInfo[];
    topics: ITopicBase[];
};

export default async function StatePage({ params }: Params) {
    const { appShortName, state } = await params;
    if (listAppState.includes(appShortName)) {
        const response = await axiosInstance.get(
            `${API_PATH.GET_DATA_STATE}/${appShortName}?state=${state}`
        );

        const { appInfo } = await fetchAppData(appShortName);

        const data: IRes = response?.data?.data;
        if (!data || !appInfo) {
            redirect(`/${appShortName}`);
        }

        return (
            <NewHome
                listTopics={data.topics}
                tests={data.fullTests}
                _state={state}
                appInfo={appInfo}
            />
        );
    }
    redirect(`/${appShortName}`);
}
