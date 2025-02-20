import clsx from "clsx";
import { IFeedBack } from ".";

type ICardFeeBack = {
    text: string;
    des: string;
    onSelect: (e: IFeedBack) => void;
    type: IFeedBack;
    select: IFeedBack;
};

export const CardFeeBack = ({
    text,
    des,
    onSelect,
    type,
    select,
}: ICardFeeBack) => {
    const handleSelect = () => onSelect(type);

    return (
        <div
            className={clsx(
                "bg-white w-full h-full flex items-center justify-between gap-6 p-4 rounded-lg border border-solid",
                {
                    "border-primary": select === type,
                }
            )}
            onClick={handleSelect}
        >
            <div className="flex-1">
                <p className="text-base font-medium">{text}</p>
                <p className="text-[#21212185] text-xs font-normal">{des}</p>
            </div>
            <div
                className={clsx("w-5 h-5 rounded-full bg-white  border-solid", {
                    "border-primary border-[6px]": select === type,
                    border: select !== type,
                })}
            ></div>
        </div>
    );
};
