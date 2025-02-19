import { selectListQuestion } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";

type IProps = {
    isActions?: boolean;
};
const ProgressQuestion: React.FC<IProps> = ({ isActions = false }) => {
    const listQuestion = useAppSelector(selectListQuestion);
    const sortedListQuestion = [...listQuestion].sort((a, b) => {
        if (a.localStatus === "correct" && b.localStatus !== "correct")
            return -1;
        if (a.localStatus !== "correct" && b.localStatus === "correct")
            return 1;
        if (a.localStatus === "incorrect" && b.localStatus !== "incorrect")
            return -1;
        if (a.localStatus !== "incorrect" && b.localStatus === "incorrect")
            return 1;
        return 0;
    });

    return (
        <div className="sm:flex rounded-lg hidden bg-[#21212133] overflow-hidden w-full h-[6px]">
            {sortedListQuestion.map((item, index) => (
                <div
                    key={index}
                    className={ctx("h-2  w-full", {
                        "bg-[#21212185]":
                            isActions && item.localStatus !== "new",
                        "bg-[#07C58C]":
                            item.localStatus === "correct" && !isActions,
                        "bg-[#FF746D]":
                            item.localStatus === "incorrect" && !isActions,
                    })}
                ></div>
            ))}
        </div>
    );
};

export default ProgressQuestion;
