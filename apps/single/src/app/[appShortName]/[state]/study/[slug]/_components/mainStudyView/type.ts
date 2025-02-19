export interface IChoice {
    id: number;
    content: string;
    questionId: number;
    isCorrect: boolean;
    selected: boolean;
    explanation: string;
}
