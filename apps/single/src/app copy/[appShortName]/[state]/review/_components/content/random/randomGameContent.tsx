import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import IconBack from "@/components/icon/iconBack";
import IconSubmit from "@/components/icon/iconSubmit";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import RouterApp from "@/constants/router.constant";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext } from "react";
import { ReviewContext } from "../../context";

const RandomGameContent = () => {
    const { selectType } = useContext(ReviewContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const handleBack = useCallback(() => {
        router.push(RouterApp.Home);
    }, [router]);
    const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));

    return (
        <div className="sm:shadow-custom bg-transparent sm:bg-white pb-12 sm:pb-0  rounded-2xl dark:bg-black">
            <div className="p-0 sm:p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between sm:justify-center ">
                    <div className="sm:hidden" onClick={handleBack}>
                        <IconBack />
                    </div>
                    <h3 className="text-xl capitalize font-semibold ">
                        {selectType} Questions
                    </h3>
                    <div className="sm:hidden" onClick={setOpenConfirm}>
                        <IconSubmit />
                    </div>
                </div>
                <ProgressQuestion />
                <QuestionContent />
                <ChoicesPanel />
                <ExplanationDetail />
            </div>
            <BottomActions type="review" />
        </div>
    );
};

export default React.memo(RandomGameContent);
