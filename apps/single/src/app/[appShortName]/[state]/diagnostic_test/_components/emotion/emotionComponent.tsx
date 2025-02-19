// import CongratsAnim from "./congratsAnim";
import LazyLoadImage from "@/components/images";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";
import { ICurrentGame } from "@/models/game/game";

const EmotionComponent = () => {
    const { currentGame } = useAppSelector(gameState);

    const percentUser = getPercentUser(currentGame);

    if (currentGame?.selectedAnswer) {
        return (
            <div className="flex  justify-center relative gap-[10px] items-center">
                {/* {isCorrect ? <CongratsAnim /> : null} */}

                {currentGame.selectedAnswer?.correct && (
                    <LazyLoadImage
                        classNames="w-10 h-10"
                        src="/images/icon-congrat/happy.png"
                        data-src="/images/icon-congrat/happy.png"
                        data-srcset="/images/icon-congrat/happy.png"
                        alt="Emotion Face"
                    />
                )}
                {!currentGame.selectedAnswer?.correct && (
                    <LazyLoadImage
                        classNames="w-10 h-10"
                        src="/images/icon-congrat/sad.png"
                        data-src="/images/icon-congrat/sad.png"
                        data-srcset="/images/icon-congrat/sad.png"
                        alt="Emotion Face"
                    />
                )}

                <p className="font-medium text-xs sm:text-lg text-[#587CDA]">
                    {!currentGame.selectedAnswer?.correct
                        ? "Oops! You are one of " +
                          percentUser +
                          "% of test-takers missed this question. Let's move on!"
                        : "Congrats! You are one of " +
                          (100 - percentUser) +
                          "% of test-takers correctly got this question. Let's move on!"}
                </p>
            </div>
        );
    }
    return null;
};

// /** fake dữ liệu */
const getPercentUser = (question: ICurrentGame) => {
    if (!question) return 0;
    const dif = question?.level === -1 ? 2 : question.level < 50 ? 1 : 3;
    let per = question.id % 100;
    if (dif == 1) {
        while (per > 30) {
            per -= 10;
        }
    } else if (dif == 2) {
        if (per > 60) {
            while (per > 60) {
                per -= 10;
            }
        } else if (per < 40) {
            while (per < 40) {
                per += 10;
            }
        }
    } else if (dif == 3) {
        while (per < 60) {
            per += 10;
        }
    }
    return per;
};
export default EmotionComponent;
