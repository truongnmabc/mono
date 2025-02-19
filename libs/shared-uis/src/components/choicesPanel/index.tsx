"use client";
import { setCurrentQuestion } from "@/redux/features/game";
import {
    selectCurrentGame,
    selectGameDifficultyLevel,
    selectCurrentTopicId,
    selectCurrentQuestionIndex,
    selectEnableKeyboardShortcuts,
    selectListQuestion,
    selectCurrentSubTopicProgressId,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import finishQuestionThunk from "@/redux/repository/game/finish/finishQuestion";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion/nextQuestion";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";
import RouterApp from "@/constants/router.constant";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import AnswerButton from "../answer";
import { MOCK_TEMP_LIST_ANSWER } from "./mock";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import { IGameMode } from "@/models/tests";
import { TypeParam } from "@/constants";

function shuffleArray<T>(array: T[]): T[] {
    if (array && array.length) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]]; // Hoán đổi vị trí
        }
        return copy;
    }
    return [];
}

type IProps = {
    isActions?: boolean;
    isBlockEnter?: boolean;
};
const ChoicesPanel: React.FC<IProps> = ({
    isActions = false,
    isBlockEnter = false,
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const type = searchParams?.get("type") as IGameMode;

    const idTopic = useAppSelector(selectCurrentTopicId);
    const currentGame = useAppSelector(selectCurrentGame);
    const listQuestion = useAppSelector(selectListQuestion);
    const feedBack = useAppSelector(selectGameDifficultyLevel);
    const subTopicProgressId = useAppSelector(selectCurrentSubTopicProgressId);
    const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
    const isListen = useAppSelector(selectEnableKeyboardShortcuts);
    const listLength = listQuestion.length;

    const listRandomQuestion = useMemo(
        () =>
            currentGame?.answers
                ? shuffleArray(currentGame.answers)
                : MOCK_TEMP_LIST_ANSWER,
        [currentGame?.answers]
    );

    const handleEnter = useCallback(async () => {
        if (type === "learn") {
            const isFinal = listQuestion.every(
                (item) => item.localStatus === "correct"
            );
            if (isFinal) {
                dispatch(
                    finishQuestionThunk({
                        subTopicProgressId,
                        topicId: idTopic,
                    })
                );
                router.replace(
                    `/finish?subTopicId=${subTopicProgressId}&topic=${params?.["slug"]}&partId=${idTopic}`,
                    { scroll: true }
                );
            } else {
                dispatch(nextQuestionThunk());
            }
            return;
        }
        // xử lý với trường hợp làm bài practice test
        if (type === "practiceTests") {
            if (indexCurrentQuestion + 1 === listLength) {
                dispatch(finishPracticeThunk());

                const _href = `${RouterApp.ResultTest}?type=${TypeParam.practiceTest}&testId=${idTopic}`;
                router.replace(_href);
            } else {
                dispatch(nextQuestionThunk());
            }
            return;
        }

        if (pathname?.includes("diagnostic_test")) {
            if (indexCurrentQuestion + 1 === listLength) {
                dispatch(finishDiagnosticThunk());

                const _href = `${RouterApp.ResultTest}?type=${TypeParam.diagnosticTest}&testId=${idTopic}`;
                router.replace(_href);
            } else {
                dispatch(nextQuestionDiagnosticThunk());
            }
            return;
        }

        if (pathname?.includes("final_test")) {
            if (indexCurrentQuestion + 1 < listLength) {
                dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
            } else {
                dispatch(shouldOpenSubmitTest(true));
            }
            return;
        }

        if (pathname?.includes("custom_test")) {
            if (feedBack === "newbie") dispatch(nextQuestionDiagnosticThunk());
            else if (feedBack === "exam")
                dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
            else if (feedBack === "expert") dispatch(nextQuestionThunk());
        }
    }, [
        dispatch,
        listQuestion,
        idTopic,
        subTopicProgressId,
        indexCurrentQuestion,
        listLength,
        type,
        pathname,
        router,
        params,
        feedBack,
    ]);

    useEffect(() => {
        const handleKeyboardEvent = (event: globalThis.KeyboardEvent) => {
            if (
                (currentGame?.answers && !currentGame.selectedAnswer) ||
                pathname?.includes("final_test")
            ) {
                const index = parseInt(event.key, 10);
                if (index >= 0 && index <= currentGame.answers.length) {
                    document.getElementById(index.toString())?.click();
                }
            }

            if (event.key === "Enter" || event.code === "NumpadEnter") {
                event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
                if (currentGame.selectedAnswer) {
                    handleEnter(); // Gọi hàm xử lý khi có đáp án được chọn
                }
            }
        };
        if (!isBlockEnter && isListen) {
            document.addEventListener("keydown", handleKeyboardEvent);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyboardEvent);
        };
    }, [isBlockEnter, currentGame, isListen, handleEnter, pathname]);

    return (
        <div className={"grid gap-2 grid-cols-1 sm:grid-cols-2"}>
            {listRandomQuestion?.map((choice, index) => (
                <AnswerButton
                    choice={choice}
                    index={index}
                    key={choice?.id}
                    isActions={isActions}
                    currentGame={currentGame}
                />
            ))}
        </div>
    );
};

export default ChoicesPanel;
