export interface IUserInfo {
    id: string;
    name: string;
    email: string;
    image: string;
    status: number;
    phoneNumber: number;
    isPro: boolean;
}
export class UserInfo implements IUserInfo {
    id: string;
    name: string;
    email: string;
    image: string;
    status: number;
    phoneNumber: number;
    isPro: boolean;
    constructor(object: Partial<IUserInfo> = {}) {
        this.id = object.id ?? "";
        this.name = object.name ?? "";
        this.email = object.email ?? "";
        this.phoneNumber = object.phoneNumber ?? 0;
        this.status = object.status ?? 0;
        this.image = !!object?.image ? object?.image : "/images/avatar.png";
        this.isPro = object.isPro ?? false;
    }
}
