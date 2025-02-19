import CloseIcon from "@/asset/icon/CloseIcon";
import RouterApp from "@/constants/router.constant";
import { selectCurrentSubTopicIndex } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const replaceName = (path?: string) => {
    const key = path?.replace("-practice-test", "");
    return key?.replaceAll("-", " ");
};

const TitleFinishPage = () => {
    const topicName = useSearchParams()?.get("topic");
    const topic = replaceName(topicName || "");
    const router = useRouter();
    const handleBack = () => router.push(RouterApp.Home);
    const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);
    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6">
            <div className="text-center hidden sm:block mx-6 py-2 relative bg-white rounded-full">
                <div
                    onClick={handleBack}
                    className="top-0  hover:bg-[#2121210A] cursor-pointer flex items-center justify-center h-full  w-12 rounded-full bg-white shadow-close absolute left-0"
                >
                    <CloseIcon />
                </div>
                <h3 className="text-2xl font-semibold capitalize font-poppins">
                    {topic}
                </h3>
            </div>

            <div className="flex items-center  justify-between sm:hidden">
                <div onClick={handleBack}>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium capitalize font-poppins">
                    {topic}
                </h3>
                <div></div>
            </div>

            <div>
                <h2 className="text-2xl sm:text-3xl text-center font-semibold">
                    Core {indexSubTopic} Completed!
                </h2>
                <h3 className="text-center pt-2 sm:pt-4 text-sm  sm:text-base font-normal">
                    Time for a dance break! (Disclaimer: App is not responsible
                    for any injuries sustained during spontaneous dance
                    celebrations.)
                </h3>
            </div>
        </div>
    );
};

export default React.memo(TitleFinishPage);
