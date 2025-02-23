import { MtUiButton } from "@/components/button";
import clsx from "clsx";
import React, { useCallback, useContext, useState } from "react";
import { ReviewContext } from "../context";
import dynamic from "next/dynamic";
import { genRandomQuestion } from "../content/random";
import { useAppDispatch } from "@/redux/hooks";
import { startRandomReview } from "@/redux/features/game";
const Sheet = dynamic(() => import("@/components/sheet"), {
    ssr: false,
});
const list = [10, 20, 30, 40, 50, 60];
const SheetSelectQuestions = () => {
    const [value, setValue] = useState(40);
    const { isOpenSheet, setIsOpenSheet, setIsStart, setIsShowList } =
        useContext(ReviewContext);
    const dispatch = useAppDispatch();

    const handleSelect = useCallback((value: number) => {
        setValue(value);
    }, []);

    const handleCancel = useCallback(() => {
        setIsOpenSheet(false);
    }, [setIsOpenSheet]);

    const handleStart = useCallback(async () => {
        const list = await genRandomQuestion({
            value: value,
            excludeListID: [],
        });

        dispatch(
            startRandomReview({
                listQuestion: list,
            })
        );
        setIsOpenSheet(false);

        setIsStart(true);
        setIsShowList(false);
    }, [value, setIsOpenSheet, setIsStart, setIsShowList, dispatch]);

    return (
        <Sheet visible={isOpenSheet} onClose={handleCancel} autoHeight>
            <div className="px-6 pb-6 flex flex-col gap-6">
                <p className="text-center text-xl px-6 font-semibold">
                    How many questions do you want?
                </p>
                <div className="w-full flex items-center justify-between">
                    {list.map((item) => (
                        <div
                            className={clsx(
                                " rounded-full w-10 text-sm h-10  flex items-center justify-center ",
                                {
                                    "bg-primary text-white": item === value,
                                    "bg-[#21212114]": item !== value,
                                }
                            )}
                            key={item}
                            onClick={() => handleSelect(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className="w-full flex items-center gap-4">
                    <MtUiButton size="large" block onClick={handleCancel}>
                        Cancel
                    </MtUiButton>
                    <MtUiButton
                        size="large"
                        block
                        type="primary"
                        onClick={handleStart}
                    >
                        Start
                    </MtUiButton>
                </div>
            </div>
        </Sheet>
    );
};

export default SheetSelectQuestions;
