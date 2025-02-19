"use client";
import React, { ReactNode } from "react";

export type ISelectReview = "random" | "weak" | "hard" | "saved" | "all";
export interface IContextReview {
    selectType: ISelectReview;
    setSelectType: (e: ISelectReview) => void;
    isStart: boolean;
    setIsStart: (e: boolean) => void;
    isOpenSheet: boolean;
    setIsOpenSheet: (e: boolean) => void;
    isShowList: boolean;
    setIsShowList: (e: boolean) => void;
}

export const ReviewContext = React.createContext<IContextReview>({
    selectType: "random",
    setSelectType: () => {},
    isStart: false,
    setIsStart: () => {},
    isOpenSheet: false,
    setIsOpenSheet: () => {},
    isShowList: false,
    setIsShowList: () => {},
});

const ReviewProvider = ({ children }: { children: ReactNode }) => {
    const [selectType, setSelectType] = React.useState<ISelectReview>("random");
    const [isStart, setIsStart] = React.useState<boolean>(false);
    const [isOpenSheet, setIsOpenSheet] = React.useState<boolean>(false);
    const [isShowList, setIsShowList] = React.useState<boolean>(true);

    return (
        <ReviewContext.Provider
            value={{
                selectType,
                setSelectType,
                isStart,
                setIsStart,
                isOpenSheet,
                setIsOpenSheet,
                isShowList,
                setIsShowList,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};
export default ReviewProvider;
