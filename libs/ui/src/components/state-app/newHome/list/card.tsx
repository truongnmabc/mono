"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IAppInfo } from "@/models/app/appInfo";
import { IGameMode } from "@/models/tests";
import { ITestInfo } from "@/models/tests/tests";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
// import { trackingEventGa4 } from "@/services/googleEvent";

const CardItem = ({
    topic,
    test,
    type,
    _state,
    appInfo,
}: {
    topic: ITopicBase;
    test?: ITestInfo;
    type: IGameMode;
    _state: string;
    appInfo: IAppInfo;
}) => {
    const listTopics = [
        {
            label: 1,
            value: () => {
                return (
                    <Fragment>
                        Nearly{" "}
                        <span className="font-medium">
                            {topic?.totalQuestion || 100}
                        </span>{" "}
                        questions
                    </Fragment>
                );
            },
        },
        {
            label: 2,
            value: () => {
                return (
                    <Fragment>
                        Based on{" "}
                        <span className="font-medium capitalize">{_state}</span>{" "}
                        <span className="font-medium uppercase">
                            {appInfo?.appShortName}
                        </span>{" "}
                        handbook
                    </Fragment>
                );
            },
        },
    ];

    const listTest = [
        {
            label: 1,
            value: () => {
                return (
                    <Fragment>
                        <span className="font-medium">
                            {test?.totalQuestion}
                        </span>{" "}
                        questions
                    </Fragment>
                );
            },
        },
        {
            label: 2,
            value: () => {
                return (
                    <Fragment>
                        <span className="font-medium ">
                            {(test?.timeTest || 0) / 60}
                        </span>{" "}
                        mistakes allowed to pass
                    </Fragment>
                );
            },
        },
    ];

    const router = useRouter();

    const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
        if (type === "learn") {
            // trackingEventGa4()

            // ga.event({
            //     action: "click_topic",
            //     params: {
            //         from: window.location.href,
            //         to: topic.tag,
            //     },
            // });
            console.log("🚀 ~ topic:", topic);

            // router.push(topic.slug);
        }
        if (type === "practiceTests") {
            // trackingEventGa4()
            // ga.event({
            //     action: "click_full_test",
            //     params: {
            //         from: window.location.href,
            //     },
            // });
            router.push(test?.slug || "");
        }
    };

    const list = type === "learn" ? listTopics : listTest;
    const isMobile = useIsMobile();
    return (
        <div className=" w-full bg-white overflow-hidden flex gap-4  border-none outline-none p-0 sm:p-6 relative  rounded-2xl ">
            <div className="lg:w-[196px] sm:w-16  sm:h-16 rounded-lg lg:h-[196px] hidden sm:block">
                {/* <LazyLoadImage
                    src={(type === "learn" ? topic?.img : test?.img) || ""}
                    classNames="rounded-2xl sm:w-[196px] sm:h-[196px]"
                /> */}
            </div>
            <div
                className="flex-1 z-10  flex rounded-2xl sm:rounded-none border-none outline-none  p-4 sm:p-0 justify-between gap-4 sm:gap-0 flex-col"
                style={{
                    background: isMobile
                        ? "linear-gradient(110.16deg, #FFFFFF 3.15%, rgba(255, 255, 255, 0.8) 50.54%, rgba(255, 255, 255, 0.24) 98.51%)"
                        : "transparent",
                }}
            >
                <div>
                    {type === "learn" ? (
                        <div className="text-lg font-semibold">
                            Practice{" "}
                            <span className=" capitalize">{_state}</span>{" "}
                            <span className=" uppercase">
                                {appInfo?.appShortName}
                            </span>{" "}
                            {topic?.name} questions{" "}
                        </div>
                    ) : (
                        <div className="text-lg font-semibold">
                            Take the full{" "}
                            <span className=" capitalize">{_state}</span>{" "}
                            <span className=" uppercase">
                                {appInfo?.appShortName}
                            </span>{" "}
                            {test?.title} test
                        </div>
                    )}
                    <ul className="list-disc pt-3 m-0 pl-1 list-inside marker:text-black">
                        {list?.map((item) => (
                            <li
                                className="py-1 text-sm font-normal"
                                key={item?.label}
                            >
                                {item.value()}
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    className="bg-[#343F82] cursor-pointer w-full sm:w-fit text-center rounded-lg text-white px-8 py-2 text-base font-semibold"
                    onClick={handleClick}
                >
                    {type === "learn" ? "Practice now" : "Take the test now"}
                </div>
            </div>
            {isMobile && (
                <div className="absolute border outline-none overflow-hidden top-0 bottom-0 left-0 right-0 z-0">
                    {/* <LazyLoadImage
                        src={(type == "learn" ? topic.img : test?.img) || ""}
                        classNames="rounded-2xl "
                        imgClassNames="object-fill w-full"
                    /> */}
                </div>
            )}
        </div>
    );
};

export default CardItem;
