export type IAction = ('like' | 'dislike' | 'save')[];
export interface IUserActions {
  userId: number;
  actions: IAction;
  questionId: number;
  sync?: 0 | 1;
}
export class UserActions implements IUserActions {
  userId: number;
  actions: IAction;
  questionId: number;
  constructor(object: Partial<IUserActions> = {}) {
    this.userId = object.userId ?? -1;
    this.questionId = object.questionId ?? -1;
    this.actions = object.actions ?? [];
  }
}
