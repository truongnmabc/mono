import ExplanationDetail from "@/components/explanation";
import { selectHasRetakenDiagnosticTest } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import React from "react";

const Explanation = () => {
    const isUnLock = useAppSelector(selectHasRetakenDiagnosticTest);

    return <ExplanationDetail unLock={!isUnLock} />;
};

export default React.memo(Explanation);
