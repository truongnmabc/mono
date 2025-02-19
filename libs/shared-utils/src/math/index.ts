import { ITopic, IQuestion } from "@shared-models";

export const groupTopics = (
    listTopic: ITopic[],
    sequence: number
): Array<{ id: number; value: ITopic[] }> => {
    const arr: Array<{ id: number; value: ITopic[] }> = [];
    let idx = 0;

    for (let i = 0; i < listTopic.length; i++) {
        if (!arr[idx]) arr[idx] = { id: idx + 1, value: [] };
        arr[idx].value.push(listTopic[i]);
        if (arr[idx].value.length === sequence) idx++;
    }

    return arr;
};

export const calculatorAverageLevel = (questions: IQuestion[]): number => {
    const listLevel = questions.map((ques) =>
        ques.level < 0 ? 50 : ques.level
    );

    const totalLevel = listLevel.reduce((acc, curr) => acc + curr, 0);

    return totalLevel / listLevel.length;
};

export function generateRandomNegativeId(exclude: number): number {
    let randomId: number;
    do {
        randomId = -Math.floor(Math.random() * 1000);
    } while (randomId === exclude);
    return randomId;
}
