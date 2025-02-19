import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import MyContainer from "@/components/container";
import HeaderMobile from "@/components/headerMobile";
import SeoContent from "@/components/seoContent/seoContent";
import { requestGetTitleSeoPage } from "@/services/titleSeo.service";
import Grid2 from "@mui/material/Grid2";
import { Fragment } from "react";
import MainStudyView from "./_components/mainStudyView";
import QuestionGroup from "./_components/questionGroup";

type Params = Promise<{ appShortName: string; slug: string }>;

export default async function Page(props: { params: Params }) {
    const params = await props.params;

    const { content } = await requestGetTitleSeoPage(params.slug);

    return (
        <Fragment>
            <Grid2 container>
                <Grid2
                    size={{
                        sm: 0,
                        md: 0,
                        xs: 12,
                    }}
                >
                    <HeaderMobile />
                </Grid2>
            </Grid2>
            <MyContainer className="py-4">
                <Grid2
                    container
                    spacing={{ xs: 0, sm: 2 }}
                    className="w-full h-full"
                >
                    <Grid2
                        size={{
                            sm: 3,
                            xs: 0,
                        }}
                    >
                        <QuestionGroup />
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full pb-24 sm:pb-0  min-h-full flex flex-1 flex-col gap-4 sm:gap-6   h-full">
                            <MainStudyView />
                            <BannerDownloadApp />
                            {content && (
                                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                                    <SeoContent content={content} />
                                </div>
                            )}
                        </div>
                    </Grid2>
                </Grid2>
            </MyContainer>
        </Fragment>
    );
}
