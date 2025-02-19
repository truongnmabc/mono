export interface IMember {
    ID: number; // ID của thành viên
    username: string; // Tên đăng nhập hoặc email
    email: string; // Địa chỉ email
    name: string; // Tên đầy đủ của thành viên
    role: string; // Vai trò của thành viên
    avatar: string; // Đường dẫn ảnh đại diện
    user_nicename: string; // Tên hiển thị thân thiện
}

export class Member implements IMember {
    ID: number;
    username: string;
    email: string;
    name: string;
    role: string;
    avatar: string;
    user_nicename: string;

    constructor(object: Partial<IMember> = {}) {
        this.ID = object.ID ?? 0;
        this.username = object.username ?? "";
        this.email = object.email ?? "";
        this.name = object.name ?? "";
        this.role = object.role ?? "";
        this.avatar = object.avatar ?? "";
        this.user_nicename = object.user_nicename ?? "";
    }
}
