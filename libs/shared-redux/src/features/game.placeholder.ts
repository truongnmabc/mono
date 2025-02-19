import { ICurrentGame, IGameReducer } from "@/models/game/game";
import { IStatusAnswer } from "@/models/question/questions";

export const plateHolderCurrentGame: ICurrentGame = {
    localStatus: "new" as IStatusAnswer,
    selectedAnswer: null,
    text: "",
    turn: 1,
    answers: [],
    explanation: "",
    id: -1,
    level: 50,
    topicId: -1,
    parentId: -1,
    status: 0,
    syncStatus: 0,
    image: "",
    partId: -1,
    contentType: 0,
    icon: "",
    paragraphId: -1,
    subTopicId: -1,
    subTopicTag: "",
    tag: "",
    count: 1,
    feedBack: "exam",
};

export const initGameReducer: IGameReducer = {
    currentGame: plateHolderCurrentGame,
    listQuestion: [],
    passingThreshold: 80, // Phần trăm đúng cần để qua bài test
    currentQuestionIndex: 0, // Vị trí câu hỏi hiện tại trong danh sách
    currentTopicId: -1, // ID của chủ đề hiện tại trong game
    incorrectQuestionIds: [], // Danh sách ID câu hỏi làm sai
    isFirstAttempt: true, // Lần đầu tiên làm bài hay không
    isGameCompleted: false, // Bài test đã hoàn thành hay chưa?
    currentSubTopicIndex: 1, // Vị trí của sub-topic hiện tại trong game
    currentSubTopicProgressId: -1, // ID tiến trình của sub-topic hiện tại
    attemptNumber: 1, // Lượt làm bài (lần 1, 2, 3,...)
    totalDuration: -1, // Tổng thời gian của bài test
    gameMode: "learn", // Chế độ của game: learn/test
    isGamePaused: false, // Game đang bị tạm dừng hay không
    isTimeUp: false, // Hết thời gian hay chưa?
    remainingTime: -1, // Thời gian còn lại của bài test
    gameDifficultyLevel: "newbie", // Cấp độ bài test (newbie, expert, ...)
    enableKeyboardShortcuts: true, // Có kích hoạt phím tắt không?
    isDataLoaded: false, // Xác định xem đã load data xong chưa
    hasRetakenDiagnosticTest: false, // Xác định rằng đã làm qua 1 lần diagnostic test, nhưng lần sau là làm lại
    shouldLoading: false,
    isCreateNewTest: false,
};
