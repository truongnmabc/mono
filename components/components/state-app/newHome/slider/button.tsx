import React, {
    ComponentPropsWithRef,
    useCallback,
    useEffect,
    useState,
} from "react";
import { EmblaCarouselType } from "embla-carousel";

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean;
    nextBtnDisabled: boolean;
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        console.log("🚀 ~ usePrevNextButtons ~ emblaApi:", emblaApi);

        onSelect(emblaApi);
        emblaApi.on("reInit", onSelect).on("select", onSelect);
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    };
};

type PropType = ComponentPropsWithRef<"button">;

export const PrevButton: React.FC<PropType> = (props) => {
    const { ...restProps } = props;

    return (
        <button
            style={{
                boxShadow: "0px 4px 8px 0px #21212129",
            }}
            className="w-10  h-10 z-20  rounded-full flex items-center justify-center bg-white"
            type="button"
            {...restProps}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12.381 16.2863L7.20638 11.1117C6.59527 10.5006 6.59527 9.50056 7.20638 8.88945L12.381 3.71484"
                    stroke="#212121"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export const NextButton: React.FC<PropType> = (props) => {
    const { ...restProps } = props;

    return (
        <button
            style={{
                boxShadow: "0px 4px 8px 0px #21212129",
            }}
            className="w-10  h-10 z-20  rounded-full flex items-center justify-center bg-white"
            type="button"
            {...restProps}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7.61853 3.71373L12.7931 8.88833C13.4042 9.49944 13.4042 10.4994 12.7931 11.1106L7.61853 16.2852"
                    stroke="#212121"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};
