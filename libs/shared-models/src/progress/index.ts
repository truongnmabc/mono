import { IAnswer } from "../question";

export interface IUserQuestionProgress {
    selectedAnswers: Omit<IAnswer, "explanation" | "index" | "text">[];
    id: number;
    parentId: number;
    level: number;
}
