import { EmblaOptionsType } from "embla-carousel";
import { NextButton, PrevButton, usePrevNextButtons } from "./button";
import useEmblaCarousel from "embla-carousel-react";

const SwiperBlock = ({ listBlock }: { listBlock?: IItemBlock[] }) => {
    const options: EmblaOptionsType = {};

    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <div className="w-full h-full pt-4 sm:pt-6 z-0 relative  ">
            <div
                className="w-full h-full overflow-hidden relative z-0  "
                ref={emblaRef}
            >
                <div className=" w-full h-full  flex gap-4 sm:gap-6">
                    {listBlock?.map((item, index) => (
                        <ITemBlock key={index} item={item} />
                    ))}
                </div>
            </div>
            <div className="hidden sm:absolute top-0 h-full w-fit -left-12 z-10 sm:flex items-center">
                <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                />
            </div>
            <div className="hidden sm:absolute top-0 h-full w-fit -right-12 z-10 sm:flex items-center">
                <NextButton
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                />
            </div>
        </div>
    );
};

export default SwiperBlock;

import { IItemBlock } from "@/models/state/stateChildrenApp";
import LazyLoadImage from "@/components/images";

const ITemBlock = ({ item }: { item: IItemBlock }) => {
    return (
        <div className="p-0 sm:p-4 w-silder_2/3 sm:w-slider flex-shrink-0  rounded-2xl bg-transparent sm:bg-white  flex flex-col justify-between gap-[10px] h-full">
            <div className=" relative sm:static aspect-square sm:aspect-video w-full flex items-center rounded-lg ">
                <LazyLoadImage
                    src={item?.thumbnail}
                    imgClassNames="h-full  w-full object-cover rounded-lg"
                    classNames="w-[360px] h-[240px]"
                />
                <div className="sm:hidden absolute bottom-2 flex items-center justify-center w-full left-0">
                    <div
                        className="text-base sm:hidden cursor-pointer  bg-white text-center max-h-12 py-2 px-6 flex items-center justify-center  font-medium  text-[#343F82] rounded-full"
                        style={{
                            backdropFilter: "blur(8px)",
                        }}
                        onClick={() => {
                            const _href = `https://cdl-prep.com/${item?.post?.post_name}`;
                            window.location.href = _href;
                        }}
                    >
                        Read More
                    </div>
                </div>
            </div>
            <div className="flex flex-row  sm:flex-col gap-[10px] w-full overflow-hidden">
                <div className="flex gap-2 w-8 h-8 sm:w-full sm:h-6 items-center">
                    <LazyLoadImage
                        classNames=" w-6 h-6 "
                        imgClassNames="rounded-full"
                        src={item?.avatar}
                        alt="avatar"
                    />
                    <p className="text-[#343F82] hidden sm:block text-sm font-normal">
                        By {item?.author?.display_name}
                    </p>
                </div>
                <div className="flex-1 flex flex-col sm:gap-[10px] overflow-hidden">
                    <p className="text-[#212121] text-sm sm:text-base w-full truncate sm:whitespace-normal sm:line-clamp-2  sm:h-12 max-h-12 font-semibold">
                        {item?.post?.post_title}
                    </p>
                    <p className="text-[#212121] truncate sm:whitespace-normal text-xs sm:text-sm font-normal">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: item?.post?.post_content?.slice(0, 120),
                            }}
                            className="line-clamp-2"
                        />
                    </p>
                    <div
                        className="hidden sm:flex items-center w-full justify-between"
                        style={{
                            padding: "1px",
                        }}
                    >
                        <div
                            onClick={() => {
                                const _href = `https://cdl-prep.com/${item?.post?.post_name}`;
                                window.location.href = _href;
                            }}
                            className="text-base cursor-pointer text-center max-h-12 py-2 px-6 flex items-center justify-center rounded-lg font-medium border border-solid text-[#343F82] border-[#343F82] "
                        >
                            Read More
                        </div>
                        <p className="text-sm font-normal text-[#21212185]">
                            {formatDate(item?.post?.post_date)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
};
