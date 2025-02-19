"use client";
import Rating from "@mui/material/Rating";
import { IReview } from "../wrapperProPage";

type ReviewCardProps = {
    review: IReview;
};

const ReviewPanelV2 = ({ currentReviews }: { currentReviews: IReview[] }) => {
    if (currentReviews.length > 0)
        return (
            <div className="max-w-page bg-white mt-6 sm:mt-8 w-full px-4  mx-auto columns-1 sm:columns-3 gap-8">
                {currentReviews?.map((item, index) => (
                    <RVColumn review={item} key={index} />
                ))}
            </div>
        );
    return null;
};

const RVColumn = ({ review }: ReviewCardProps) => {
    return (
        <div className=" rounded-[10px] mb-3 sm:mb-6 break-inside-avoid w-full hover:-translate-y-1 h-fit p-4 sm:p-6 gap-4 flex flex-col border border-solid border-[#615f4685] items-start cursor-pointer transition-all">
            <div className="flex gap-2 ">
                <div
                    className="w-12 h-12 flex items-center justify-center  rounded-full"
                    style={{
                        backgroundColor: review?.color,
                    }}
                >
                    <span className="text-white text-2xl font-bold">
                        {review.author[0]}
                    </span>
                </div>
                <div className="flex-1">
                    <span className="text-sm sm:text-base font-medium line-clamp-1">
                        {review.author}
                    </span>
                    <span className="text-sm sm:text-base text-[#595959]">
                        {review.lastUpdate}
                    </span>
                </div>
            </div>
            <span className="text-xs sm:text-base ">{review.content}</span>
            <div className="h-4 text-primary">
                <Rating
                    name="disabled"
                    value={review.rating}
                    readOnly
                    size={"small"}
                    sx={{
                        "& .MuiSvgIcon-root": {
                            color: "var(--text-color-primary)",
                        },
                    }}
                />
            </div>
        </div>
    );
};
export default ReviewPanelV2;
