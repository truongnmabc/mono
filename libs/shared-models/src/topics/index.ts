export interface ITopicBase {
    id: number;
    parentId: number;
    name: string;
    icon: string;
    tag: string;
    // Nôị dung có phải do ai render ra không: 0 là không, 1 là có
    contentType: number;
    topics: ITopicBase[];
    slug?: string;
    //  Các phần của topic đã hoàn thành hết chưa
    status: number;
    //  level trung bình của  topic
    averageLevel: number;
    // Tổng số câu hỏi
    totalQuestion: number;
    turn: number;
    partId: number;
}
