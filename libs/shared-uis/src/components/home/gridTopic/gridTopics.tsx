import { IAppInfo } from "@/models/app/appInfo";
import { ITopicBase } from "@/models/topics/topicsProgress";
import clsx from "clsx";
import React from "react";
import PassingHome from "../passing";
import TitleTopic from "./item/titleTopic";
import Wrapper from "./item/wrapper";

const GridTopics = ({
    topics,
    appInfo,
    isMobile
}: {
    appInfo: IAppInfo;
    topics: ITopicBase[];
    isMobile:boolean
}) => {
    return (
        <div className="w-full  pt-6 sm:pt-14">
            <h3 className="sm:text-[40px] sm:leading-[60px] font-poppins text-center text-2xl font-bold">
                Practice {appInfo.appName} Test By Topics
            </h3>
            <h3 className="text-sm sm:text-base my-2 sm:my-8 text-[#212121CC] sm:text-[#212121] text-center">
                Our {appInfo?.appName} practice questions feature all 9 {""}
                {appInfo?.appName} test subjects. We recommend practicing
                questions from all subjects to guarantee your success at your
                local testing location. To get started, choose a category from
                the list below and practice now!
            </h3>

            <PassingHome isMobile={isMobile} />

            <div
                className={clsx(
                    "grid  mt-6 sm:mt-10 sm:grid-cols-1 gap-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 md:gap-4"
                )}
            >
                {topics?.map((topic, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "w-full h-full flex flex-col  sm:block"
                        )}
                    >
                        <TitleTopic
                            topic={topic}
                            priority={3}
                            classNames=" h-[52px] sm:h-[72px]"
                            imgClassNames="w-[36px] h-[36px] sm:w-[56px] sm:h-[56px]"
                        />
                        <Wrapper topicsId={topic.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(GridTopics);
