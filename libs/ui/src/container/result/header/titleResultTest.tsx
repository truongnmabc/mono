import { Fragment } from "react";

export const TitlePass = () => {
    return (
        <Fragment>
            <p className="text-[#15CB9F] sm:text-[42px] text-2xl text-center sm:text-start sm:leading-[62px] font-semibold">
                Excellent performance!
            </p>
            <p className="text-sm text-center sm:text-start sm:text-base mt-3 font-normal text-[#21212185]">
                Do not rest on your laurels, friend. Time to leaf through the
                rest of these tests and make them tremble with your intellect!
            </p>
        </Fragment>
    );
};

export const TitleMiss = () => {
    return (
        <Fragment>
            <p className="text-[#EF4444] sm:text-[42px] text-2xl text-center sm:text-start sm:leading-[62px] font-semibold">
                Not enough to pass!
            </p>
            <p className="text-sm text-center sm:text-start sm:text-base mt-3 font-normal text-[#21212185]">
                That was a tough one, but every wrong answer is a stepping stone
                to the right one. Keep at it, and you&apos;ll be a knowledge
                ninja soon!
            </p>
        </Fragment>
    );
};
