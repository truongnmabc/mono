import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IExamData } from "@/models/tests/tests";
import { ITestBase } from "@/models/tests";
import { ICurrentGame } from "@/models/game/game";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { ITopicEndTest } from ".";
import { TypeParam } from "@/constants";

export const filterCorrectList = (user: IUserQuestionProgress[]) => {
    return user?.filter(
        (item) =>
            item.selectedAnswers?.[item.selectedAnswers?.length - 1].correct
    );
};

export const getReviewTopics = (
    uniqueTags: string[],
    listQuestion: ICurrentGame[],
    topics: ITopicBase[]
): ITopicEndTest[] => {
    return uniqueTags
        .map((tag) => {
            const topic = topics?.find((t) => t.tag === tag);
            if (!topic) return null;

            const topicQuestions = listQuestion.filter((q) => q.tag === tag);
            const correctCount = topicQuestions.filter(
                (q) => q.selectedAnswer?.correct
            ).length;

            return {
                ...topic,
                totalQuestion: topicQuestions.length,
                correct: correctCount,
            };
        })
        .filter((item): item is ITopicEndTest => item !== null);
};

type ITopics = {
    type: string | null;
    topics: ITopicBase[] | undefined;
    questions: ITestBase | undefined;
    listExam: IExamData[];
    listQuestion: ICurrentGame[];
};
export const calculateTopics = ({
    listExam,
    listQuestion,
    questions,
    topics,
    type,
}: ITopics): ITopicEndTest[] => {
    let listTopic: ITopicEndTest[] = [];

    if (type === TypeParam.diagnosticTest) {
        if (topics) {
            listTopic = topics.map((t) => ({
                ...t,
                totalQuestion: 3,
                correct: listQuestion.filter(
                    (q) => q.selectedAnswer?.correct && q.tag === t.tag
                ).length,
            }));
        }
    }

    if (type === TypeParam.practiceTest || type === TypeParam.finalTest) {
        if (questions && topics && listExam) {
            listTopic = topics
                ?.filter((t) => questions?.topicIds?.includes(t.id))
                ?.map((t) => {
                    const exam = listExam.find((e) => e.topicId === t.id);
                    const correctList = listQuestion?.filter(
                        (q) =>
                            exam?.questionIds?.includes(q.id) &&
                            q.selectedAnswer?.correct
                    );

                    return {
                        ...t,
                        totalQuestion: exam?.totalQuestion || 1,
                        correct: correctList?.length || 0,
                    };
                });
        }
    }

    if (type === TypeParam.customTest) {
        if (topics && questions) {
            const totalCount = questions?.totalQuestion || 0;
            const subjectCount = questions?.topicIds?.length || 1;

            const baseQuestionCount = Math.floor(totalCount / subjectCount);
            const remainder = totalCount % subjectCount;

            listTopic = topics
                ?.filter((t) => questions?.topicIds?.includes(t.id))
                ?.map((t, index, array) => {
                    const isLast = index === array.length - 1;
                    const topicQuestions = listQuestion.filter(
                        (q) => q.parentId === t.id
                    );

                    const correctCount = topicQuestions.filter(
                        (q) => q.selectedAnswer?.correct
                    ).length;

                    return {
                        ...t,
                        totalQuestion:
                            baseQuestionCount + (isLast ? remainder : 0),
                        correct: correctCount,
                    };
                });
        }
    }

    return listTopic;
};

type IAll = {
    type: string | null;
    listExam: IExamData[];
    listQuestion: ICurrentGame[];
    topics: ITopicBase[] | undefined;
};
export const processAllQuestions = ({
    listExam,
    listQuestion,
    topics,
    type,
}: IAll): ICurrentGame[] => {
    return type === TypeParam.diagnosticTest ||
        type === TypeParam.customTest ||
        type === TypeParam.review
        ? listQuestion
        : listQuestion.map((item) => {
              const matchingExam = listExam?.find((exam) =>
                  exam.questionIds?.includes(item.id)
              );
              const matchingTopic = topics?.find(
                  (topic) => topic.id === matchingExam?.topicId
              );

              return {
                  ...item,
                  icon: matchingTopic?.icon || "",
                  tag: matchingTopic?.tag || "",
                  parentId: matchingTopic?.id || -1,
              };
          });
};

export const calculatePercentage = (
    listPass: ICurrentGame[],
    listQuestion: ICurrentGame[]
) => {
    return listPass && listQuestion?.length
        ? Math.floor((listPass.length / listQuestion.length) * 100)
        : 0;
};
export const getUniqueTags = (listQuestion: ICurrentGame[]) => {
    return listQuestion.reduce<string[]>((acc, question) => {
        if (question.tag && !acc.includes(question.tag)) {
            acc.push(question.tag);
        }
        return acc;
    }, []);
};
