"use client";
import LazyLoadImage from "@/components/images";
import MtUiRipple, { useRipple } from "@/components/ripple";
import RouterApp from "@/constants/router.constant";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectTopics } from "@/redux/features/study";
import { selectTopicsId } from "@/redux/features/study.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { trackingEventGa4 } from "@/services/googleEvent";
import { handleNavigateStudy } from "@/utils/handleNavigateStudy";
import ctx from "@/utils/mergeClass";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import Priority from "./priority";

const TitleTopic = ({
    topic,
    priority,
    classNames,
    imgClassNames,
}: {
    topic: ITopicBase;
    priority: number;
    classNames: string;
    imgClassNames?: string;
}) => {
    const appInfo = useAppSelector(selectAppInfo);
    const router = useRouter();
    const currentPathname = usePathname();
    const isMobile = useIsMobile();
    const selectedTopics = useAppSelector(selectTopicsId);
    const dispatch = useAppDispatch();

    const isAllowExpand = selectedTopics === topic?.id;

    const handleClick: React.MouseEventHandler<HTMLDivElement> = async (e) => {
        onRippleClickHandler(e);
        trackingEventGa4({
            eventName: "click_topic",
            value: {
                from: window.location.href,
                to: topic.tag,
            },
        });

        if (!isMobile && currentPathname === RouterApp.Home) {
            return handleNavigateStudy({
                dispatch,
                router,
                topic,
            });
        }

        dispatch(selectTopics(isAllowExpand ? -1 : topic.id));
    };

    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();

    return (
        <div
            className={ctx(
                "flex items-center relative p-2 overflow-hidden hover:border-primary bg-white max-h-[52px] sm:max-h-[74px] cursor-pointer w-full transition-all  border-solid border border-[#2121211F]",
                {
                    "rounded-tl-md rounded-tr-md ": isAllowExpand,
                    "rounded-md ": !isAllowExpand,
                },
                classNames
            )}
            onClick={handleClick}
        >
            <div
                className={ctx(
                    "rounded-md border-solid bg-primary-16 border-primary transition-all flex items-center rounded-tl-md  justify-center",
                    imgClassNames
                )}
            >
                {topic.icon ? (
                    <LazyLoadImage
                        src={topic.icon}
                        alt={appInfo?.appName + topic.name + "Practice Test"}
                        classNames={clsx({
                            "w-6  h-6  ": currentPathname?.includes("/study"),
                            "w-6  h-6 sm:w-8 sm:h-8 ":
                                !currentPathname?.includes("/study"),
                        })}
                        priority={false}
                        styles={{
                            filter: "brightness(0) saturate(100%) invert(81%) sepia(50%) saturate(2746%) hue-rotate(336deg) brightness(100%) contrast(98%) ",
                        }}
                    />
                ) : (
                    <div className="w-8 h-8"></div>
                )}
            </div>
            <Priority name={topic.name} priority={priority} />
            <MtUiRipple ripples={ripples} onClear={onClearRipple} />
        </div>
    );
};

export default TitleTopic;
