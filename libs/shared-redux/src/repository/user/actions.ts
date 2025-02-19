import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface IUserActions {
    status: "like" | "dislike" | "save";
    questionId: number;
    partId: number;
}

const userActionsThunk = createAsyncThunk(
    "useActionsThunk",
    async ({ status, questionId, partId }: IUserActions) => {
        const existingAction = await db?.useActions
            .where("questionId")
            .equals(questionId)
            .first();

        if (existingAction) {
            const newListActions = existingAction.actions.includes(status)
                ? existingAction.actions.filter((s) => s !== status)
                : [...existingAction.actions, status];

            await db?.useActions
                .where("questionId")
                .equals(existingAction.questionId)
                .modify((item) => {
                    item.actions = newListActions;
                })
                .then(function (deleteCount) {
                    console.log("Deleted " + deleteCount + " objects");
                });

            return {
                questionId,
                status: newListActions,
                partId,
            };
        } else {
            await db?.useActions.add({
                questionId,
                actions: [status],
                userId: -1,
                partId,
            });
        }

        return { status: [status], questionId, partId };
    }
);

export default userActionsThunk;
