import React from "react";
import ItemTopicHome from "./item";
import { IAppInfo } from "@/models/app/appInfo";
import { ITestInfo } from "@/models/tests/tests";
import { ITopicBase } from "@/models/topics/topicsProgress";
const listImg = {
    "general-knowledge": {
        lear: "/images/cdl_v2/home/1.png",
        test: "/images/cdl_v2/home/1.1.png",
    },
    hazmat: {
        lear: "/images/cdl_v2/home/4.png",
        test: "/images/cdl_v2/home/4.1.png",
    },
    "passenger-vehicles": {
        lear: "/images/cdl_v2/home/5.png",
        test: "/images/cdl_v2/home/5.1.png",
    },
    "air-brakes": {
        lear: "/images/cdl_v2/home/2.png",
        test: "/images/cdl_v2/home/2.1.png",
    },
    "combination-vehicles": {
        lear: "/images/cdl_v2/home/3.png",
        test: "/images/cdl_v2/home/3.1.png",
    },
    "doubles-triples-trailers": {
        lear: "/images/cdl_v2/home/7.png",
        test: "/images/cdl_v2/home/7.1.png",
    },
    "tanker-vehicles": {
        lear: "/images/cdl_v2/home/8.png",
        test: "/images/cdl_v2/home/8.1.png",
    },
    "school-bus": {
        lear: "/images/cdl_v2/home/6.png",
        test: "/images/cdl_v2/home/6.1.png",
    },
    "pre-trip-inspection": {
        lear: "/images/cdl_v2/home/9.png",
        test: "/images/cdl_v2/home/9.1.png",
    },
} as const;

type ListImgKey = keyof typeof listImg;

const ListHome = ({
    listTopics,
    tests,
    appInfo,
    _state,
}: {
    appInfo: IAppInfo;
    listTopics: ITopicBase[];
    tests: ITestInfo[];
    _state: string;
}) => {
    return (
        <div className="w-full h-full pt-4  pb-6 sm:pb-12 flex flex-col gap-6 sm:gap-8 ">
            {listTopics.map((topic, index) => (
                <ItemTopicHome
                    key={index}
                    topic={topic}
                    test={tests
                        .map((item) => ({
                            ...item,
                            img: listImg[item.tag as ListImgKey]?.test,
                        }))
                        ?.find((t) => t.tag === topic.tag)}
                    appInfo={appInfo}
                    _state={_state}
                />
            ))}
        </div>
    );
};

export default ListHome;
