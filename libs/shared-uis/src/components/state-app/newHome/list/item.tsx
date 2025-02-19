import React from "react";
import CardItem from "./card";
import { ITestInfo } from "@/models/tests/tests";
import { IAppInfo } from "@/models/app/appInfo";
import { ITopicBase } from "@/models/topics/topicsProgress";

const ItemTopicHome = ({
    topic,
    appInfo,
    _state,
    test,
}: {
    topic: ITopicBase;
    test?: ITestInfo;
    _state: string;
    appInfo: IAppInfo;
}) => {
    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6 ">
            <h3 className="text-lg sm:text-2xl font-semibold ">{topic.name}</h3>
            <div className="flex w-full flex-col sm:flex-row gap-4 sm:gap-6">
                <CardItem
                    type="learn"
                    test={test}
                    topic={topic}
                    appInfo={appInfo}
                    _state={_state}
                />
                <CardItem
                    type="practiceTests"
                    test={test}
                    topic={topic}
                    appInfo={appInfo}
                    _state={_state}
                />
            </div>
        </div>
    );
};

export default ItemTopicHome;
