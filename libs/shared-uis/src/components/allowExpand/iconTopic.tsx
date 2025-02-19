import ctx from "@/utils/mergeClass";
import { CheckedIcon, LockIcon } from "./icon";
import "./styles.css";
export const IconSubTopic = ({
    lock,
    isFinishThisLevel,
    currentLevelScore,
    activeAnim,
}: {
    lock: boolean;
    isFinishThisLevel: boolean;
    currentLevelScore: number;
    activeAnim: boolean;
}) => {
    return (
        <div
            className={ctx(
                "p-1 iconDrawCanvas border-solid  w-10 h-10 rounded-full",
                {
                    heartbeat: activeAnim,
                    "bg-white": lock,
                    "bg-[#f5f5f5]": !lock,
                }
            )}
            style={{
                border: "0.5px ",
                background:
                    "linear-gradient(134.17deg, #FFFFFF 4.98%, #FFFFFF 94.88%)",
                borderImageSource:
                    "linear-gradient(223deg, #FFFFFF 29.09%, #B1BDCE 85.02%)",
            }}
        >
            <div
                className={ctx(
                    "rounded-full w-full h-full  p-2  flex items-center justify-center",
                    {
                        "bg-white": !lock,
                        "bg-[#f5f5f5]": lock,
                        "bg-[#15CB9F]":
                            isFinishThisLevel ||
                            (!lock && currentLevelScore >= 50),
                        "bg-[#E3A651] text-white":
                            !lock && currentLevelScore < 50,
                    }
                )}
            >
                {activeAnim ? (
                    <div className="w-full text-white h-full text-center flex justify-center  items-center text-xs">
                        {currentLevelScore}
                        <small className="text-white">%</small>
                    </div>
                ) : isFinishThisLevel ? (
                    <CheckedIcon color="white" />
                ) : lock ? (
                    <LockIcon />
                ) : (
                    <div className="w-full text-white h-full text-center flex justify-center  items-center text-xs">
                        {currentLevelScore}
                        <small className="text-white">%</small>
                    </div>
                )}
            </div>
        </div>
    );
};
