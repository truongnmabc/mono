import {
  GameTypeStatus,
  TestConstType,
  TypeConstTest,
  TypeParam,
} from './constant';
import {
  IQuestionProgressSync,
  ITopicProgress,
  IUserQuestionProgress,
  UserQuestionProgress,
  IAnswer,
  ITopicBase,
  ITestBase,
  IQuestionBase,
  IUserActions,
} from './type';

function getYesterdayMidnightTimestamp() {
  const now = new Date();
  const midnightToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  midnightToday.setDate(midnightToday.getDate() - 1);
  return midnightToday.getTime();
}

const convertTopicsFromServer = async ({
  TopicProgress,
  topicsStore,
}: {
  TopicProgress: ITopicProgress[];
  topicsStore: IDBObjectStore;
}) => {
  if (!TopicProgress.length) return;
  try {
    await Promise.all(
      TopicProgress.map(async (topic) => {
        const record = topicsStore.get(topic.topicId);
        const data = {
          ...record,
          status: topic?.progress === 1 ? 1 : 0,
        };
        await topicsStore.put(data);
      })
    );
  } catch (err) {
    console.log('🚀 ~ convertTopicsFromServer ~ err:', err);
  }
};

const handleReaction = async ({
  QuestionProgress,
  userActionsStore,
}: {
  QuestionProgress: IQuestionProgressSync[];
  userActionsStore: IDBObjectStore;
}) => {
  if (!QuestionProgress?.length) return;

  await Promise.all(
    QuestionProgress.map(async (item) => {
      const actions = [];

      if (item.like === 1) actions.push('like');
      if (item.like === -1) actions.push('dislike');
      if (item.bookmark) actions.push('save');

      const data = {
        userId: -1,
        id: item.questionId,
        questionId: item.questionId,
        actions,
      };
      await userActionsStore.put(data);
    })
  );
};

const handleCreateNewTest = async ({
  TestInfo,
  UserTestData,
  testQuestionsStore,
  topicsStore,
}: {
  TestInfo: any[];
  UserTestData: any[];
  testQuestionsStore: IDBObjectStore;
  topicsStore: IDBObjectStore;
}): Promise<void> => {
  // Xác định danh sách các record cần cập nhật (update)
  const listUpdate =
    TestInfo.length > 0
      ? UserTestData.filter((item) =>
          TestInfo.some((test) => test.testId !== item.testId)
        )
      : UserTestData;
  // Cập nhật trạng thái của các record có sẵn
  const updatePromises = listUpdate.map(
    (item) =>
      new Promise<void>((resolve, reject) => {
        const getReq = testQuestionsStore.get(item.testId);
        getReq.onsuccess = () => {
          const record = getReq.result;
          if (record) {
            // Cập nhật lại status theo điều kiện: nếu status ban đầu là 3 thì đổi thành 1, ngược lại là 0.
            record.status = item.status === 3 ? 1 : 0;
            const putReq = testQuestionsStore.put(record);
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          } else {
            resolve();
          }
        };
        getReq.onerror = () => reject(getReq.error);
      })
  );
  await Promise.all(updatePromises);

  // Tạo mới các test từ TestInfo
  const testPromises = TestInfo.map(
    (item, index) =>
      new Promise<void>(async (resolve, reject) => {
        try {
          const {
            testId,
            testQuestionNum,
            passPercent,
            type,
            testQuestionData,
            timeTest,
            testSettingId,
          } = item;

          // Parse dữ liệu câu hỏi
          const ques = JSON.parse(testQuestionData) || [];
          // Tìm thông tin test hiện tại trong UserTestData
          const currentTest = UserTestData.find(
            (test) => test.testId === item.testId
          );
          // Lấy danh sách topicIds từ các câu hỏi
          const topicIds = ques.map((q: any) => Number(q.topicId));

          // Lấy dữ liệu của các topic từ topicsStore (không có multi-get nên dùng Promise.all)
          const topicsPromises = topicIds.map(
            (id: number) =>
              new Promise<any>((resolveTopic, rejectTopic) => {
                const req = topicsStore.get(id);
                req.onsuccess = () => resolveTopic(req.result);
                req.onerror = () => rejectTopic(req.error);
              })
          );
          const topicsArr = await Promise.all(topicsPromises);
          // Loại bỏ các topic không có dữ liệu (undefined)
          const validTopics = topicsArr.filter((t) => t !== undefined);

          // Xây dựng groupExamData dựa trên từng câu hỏi
          const groupExamData = ques.map((q: any) => ({
            topicId: Number(q.topicId),
            questionIds: q.questionIds.map((id: any) => Number(id)),
            totalQuestion: q.questionIds.length,
            topicName: validTopics.find((t: any) => t.id === Number(q.topicId))
              ?.name,
          }));

          // Giả sử TypeConstTest đã được định nghĩa/nhập từ một module nào đó
          const data = {
            id: testId,
            index,
            totalDuration: timeTest / 60,
            isGamePaused: false,
            startTime: 0,
            elapsedTime: 0,
            gameMode: TypeConstTest[type],
            passingThreshold: passPercent,
            totalQuestion: Number(testQuestionNum),
            status: currentTest && currentTest.status === 3 ? 1 : 0,
            attemptNumber: 1,
            topicIds,
            groupExamData,
            gameDifficultyLevel:
              testSettingId === 1
                ? 'newbie'
                : testSettingId === 2
                ? 'expert'
                : 'newbie',
            createDate: new Date().getTime(),
            sync: 1,
          };

          // Ghi (put) dữ liệu test mới vào store testQuestions
          const putReq = testQuestionsStore.put(data);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        } catch (err) {
          reject(err);
        }
      })
  );

  await Promise.all(testPromises);
};
// Helper: Lấy danh sách các bản ghi từ object store theo danh sách keys
const fetchRecords = ({
  objectStore,
  keys,
}: {
  keys?: number[];
  objectStore: IDBObjectStore;
}): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (keys && keys.length > 0) {
      Promise.all(
        keys.map(
          (key) =>
            new Promise<any>((res, rej) => {
              const req = objectStore.get(key);
              req.onsuccess = () => res(req.result);
              req.onerror = () => rej(req.error);
            })
        )
      )
        .then((results) => resolve(results.filter((r) => r !== undefined)))
        .catch(reject);
    } else {
      const req = objectStore.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }
  });
};

// Helper: Ghi nhiều bản ghi vào store userProgress
const updateUserProgressBulk = (
  finalData: IUserQuestionProgress[],
  store: IDBObjectStore
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const promises = finalData.map(
      (record) =>
        new Promise<void>((res, rej) => {
          const req = store.put(record);
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        })
    );
    Promise.all(promises);
  });
};
interface Ix extends UserQuestionProgress {
  testIdOrTopicId: number;
}
// Hàm chuyển đổi dữ liệu câu hỏi sử dụng IndexedDB gốc
const handleConvertQuestions = async ({
  UserQuestionProgress,
  questionsStore,
  topicsStore,
  userProgressStore,
}: {
  UserQuestionProgress: Ix[];
  questionsStore: IDBObjectStore;
  topicsStore: IDBObjectStore;
  userProgressStore: IDBObjectStore;
}): Promise<void> => {
  // Lấy danh sách questionIds từ dữ liệu người dùng
  const questionIds = UserQuestionProgress.map((item) => item.questionId);

  // Lấy dữ liệu questions và userProgress từ IndexedDB bằng helper fetchRecords
  const [questions, progress] = await Promise.all([
    fetchRecords({
      keys: questionIds,
      objectStore: questionsStore,
    }),
    fetchRecords({
      keys: questionIds,
      objectStore: topicsStore,
    }),
  ]);

  // Tạo map để gom nhóm theo questionId
  const listMap = UserQuestionProgress.reduce((acc, item) => {
    const key = item.questionId;
    if (!acc[key]) {
      acc[key] = [];
    }
    // Nếu đã có dữ liệu cho key này thì merge selectedAnswers
    if (acc[key].length > 0) {
      const currentQuestion = acc[key][0];
      const questionInfo = questions.find((q: any) => item.questionId === q.id);
      const aa = (item?.choicesSelected || [])
        .map((c: any) => {
          const answer = questionInfo?.answers.find((a: any) => a.id === c);
          if (answer) {
            return {
              ...answer,
              turn: 1,
              type:
                item.type === GameTypeStatus.learn
                  ? TypeParam.learn
                  : item.type === GameTypeStatus.practiceTests
                  ? TypeParam.practiceTests
                  : item.type === GameTypeStatus.finalTests
                  ? TypeParam.finalTests
                  : item.type === GameTypeStatus.diagnosticTest
                  ? TypeParam.diagnosticTest
                  : item.type === GameTypeStatus.customTests
                  ? TypeParam.customTests
                  : item.type === GameTypeStatus.branchTest
                  ? TypeParam.branchTest
                  : TypeParam.learn,
              parentId: item?.testIdOrTopicId,
            };
          }
          return null;
        })
        .filter((answer): answer is IAnswer => answer !== null);

      const selectedAnswers = [...currentQuestion.selectedAnswers, ...aa];

      const question: IUserQuestionProgress = {
        ...currentQuestion,
        selectedAnswers: selectedAnswers || [],
      };
      acc[key] = [question];
    } else {
      const questionInfo = questions.find((q: any) => item.questionId === q.id);
      const selectedAnswers = (item.choicesSelected || [])
        .map((c: any) => {
          const answer = questionInfo?.answers.find((a: any) => a.id === c);
          if (answer) {
            return {
              ...answer,
              turn: 1,
              parentId: item?.testIdOrTopicId,
              type:
                item.type === GameTypeStatus.learn
                  ? TypeParam.learn
                  : item.type === GameTypeStatus.practiceTests
                  ? TypeParam.practiceTests
                  : item.type === GameTypeStatus.finalTests
                  ? TypeParam.finalTests
                  : item.type === GameTypeStatus.diagnosticTest
                  ? TypeParam.diagnosticTest
                  : item.type === GameTypeStatus.customTests
                  ? TypeParam.customTests
                  : item.type === GameTypeStatus.branchTest
                  ? TypeParam.branchTest
                  : TypeParam.review,
              isSynced: true,
            };
          }
          return null;
        })
        .filter((answer): answer is IAnswer => answer !== null);

      const question: IUserQuestionProgress = {
        id: item.questionId,
        parentId: questionInfo?.partId || -1,
        level: questionInfo?.level || -1,
        selectedAnswers: selectedAnswers || [],
        isSynced: true,
      };

      acc[key].push(question);
    }
    return acc;
  }, {} as Record<string, IUserQuestionProgress[]>);

  // Gom tất cả các bản ghi đã xử lý thành 1 mảng
  const useQuestion = Object.values(listMap).flat();

  // Tạo map từ dữ liệu progress đã có (key là id)
  const progressMap = new Map<number, IUserQuestionProgress>(
    progress.map((item: any) => [item.id, item])
  );

  // Merge các bản ghi mới với progress đã có
  for (const newRecord of useQuestion) {
    const existing = progressMap.get(newRecord.id);
    if (existing) {
      // Nếu đã tồn tại, gộp selectedAnswers
      existing.selectedAnswers = mergeAnswers({
        oldAnswers: existing.selectedAnswers,
        newAnswers: newRecord.selectedAnswers,
      });
      progressMap.set(newRecord.id, existing);
    } else {
      // Nếu chưa có, thêm mới
      progressMap.set(newRecord.id, newRecord);
    }
  }

  // Chuyển map thành mảng kết quả
  const finalData: IUserQuestionProgress[] = Array.from(progressMap.values());

  // Cập nhật dữ liệu finalData vào store userProgress bằng bulk update
  await updateUserProgressBulk(finalData, userProgressStore);
};
const mergeAnswers = ({
  oldAnswers = [],
  newAnswers = [],
}: {
  oldAnswers: any[];
  newAnswers: any[];
}): IAnswer[] => {
  // Tạo mảng kết quả (shallow copy để tránh mutate)
  const merged: IAnswer[] = [...oldAnswers];

  for (const newAns of newAnswers) {
    // Tìm xem trong merged đã có answer trùng ID chưa
    const idx = merged.findIndex((oldAns) => oldAns.id === newAns.id);
    if (idx >= 0) {
      // Nếu đã có -> tùy ý cập nhật:
      // Ví dụ: update toàn bộ field (ghi đè),
      // hoặc chỉ update turn/parentId
      merged[idx] = {
        ...merged[idx],
        ...newAns,
        // Giữ lại oldAns.someField nếu muốn
      };
    } else {
      // Nếu chưa có -> thêm mới
      merged.push(newAns);
    }
  }

  return merged;
};
const handleConvertSyncTopic = async ({
  topics,
  topicsStore,
}: {
  topics?: ITopicBase[];
  topicsStore: IDBObjectStore;
}): Promise<any[]> => {
  if (!topics) return [];

  // Phân loại topics theo type
  const parentTopics = topics.filter((item) => item.type === 1);
  const subTopics = topics.filter((item) => item.type === 2);
  const parts = topics.filter((item) => item.status === 1 && item.type === 3);

  // Lấy các phần chưa được đồng bộ (isSynced false)
  const listPartSynced = parts.filter((i) => !i.isSynced);

  // Chuẩn bị danh sách cập nhật: key và thay đổi (changes)
  const partIds = listPartSynced.map((item) => ({
    key: item.id,
    changes: {
      isSynced: true,
    },
  }));

  // Bulk update trên store "topics" dùng IndexedDB gốc
  await new Promise<void>((resolve, reject) => {
    let updateCount = 0;

    if (partIds.length === 0) {
      resolve();
      return;
    }

    partIds.forEach(({ key, changes }) => {
      const req = topicsStore.get(key);
      req.onsuccess = () => {
        const record = req.result;
        if (record) {
          const updatedRecord = { ...record, ...changes };
          const putReq = topicsStore.put(updatedRecord);
          putReq.onsuccess = () => {
            updateCount++;
            if (updateCount === partIds.length) {
              resolve();
            }
          };
          putReq.onerror = () => reject(putReq.error);
        } else {
          // Nếu không có record, vẫn tính là update xong
          updateCount++;
          if (updateCount === partIds.length) {
            resolve();
          }
        }
      };
      req.onerror = () => reject(req.error);
    });
  });

  // Tạo dữ liệu sync cho các phần đã đồng bộ
  const partSync = listPartSynced.map((t) => ({
    topicId: t.id,
    passed: 1,
    lock: 0,
    progress: 1,
    lastUpdate: Date.now(),
    type: t.type,
    parentId: t.parentId,
  }));

  // Tính toán dữ liệu cho sub topics có phần con đang tiến trình
  const subTopicsInProgress = subTopics.filter((sub) =>
    parts.some((part) => part.parentId === sub.id)
  );

  const subSync = subTopicsInProgress.map((sub) => {
    const subParts = parts.filter((part) => part.parentId === sub.id);
    const totalParts =
      topics.filter((t) => t.parentId === sub.id && t.type === 3).length || 1;
    const progress = subParts.length / totalParts;
    return {
      topicId: sub.id,
      passed: progress === 1 ? 1 : 0,
      lock: 0,
      progress,
      type: sub.type,
      lastUpdate: Date.now(),
      parentId: sub.parentId,
    };
  });

  // Tính toán dữ liệu cho parent topics dựa vào các sub topics đã sync
  const parentSubTopics = parentTopics.filter((parent) =>
    subSync.some((sub) => sub.parentId === parent.id)
  );

  const parentSync = parentSubTopics.map((parent) => {
    const topic = topics.find((t) => t.id === parent.id);
    const subs = topics.filter((i) => i.parentId === topic?.id);
    const subIds = subs.map((item) => item.id);
    const listPart = topics.filter((i) => subIds.includes(i.id));
    const success = listPart.filter((i) => i.status === 1);
    const progress = listPart.length ? success.length / listPart.length : 0;

    return {
      topicId: parent.id,
      passed: progress === 1 ? 1 : 0,
      lock: 0,
      progress,
      lastUpdate: Date.now(),
    };
  });

  // Trả về mảng tổng hợp các dữ liệu sync
  return [...partSync, ...subSync, ...parentSync];
};

const handleConvertSyncReaction = async ({
  userActionStore,
  reactions,
}: {
  userActionStore: IDBObjectStore;
  reactions?: IUserActions[];
}): Promise<any[]> => {
  // Lọc ra các phản ứng chưa được đồng bộ
  const listNotSync = reactions?.filter((item) => !item.isSynced) || [];

  // Tạo ra dữ liệu sync từ các phản ứng chưa đồng bộ
  const syncReaction = listNotSync.map((r) => ({
    bookmark: r.actions.includes('save'),
    questionId: r.questionId,
    like: r.actions.includes('dislike')
      ? -1
      : r.actions.includes('like')
      ? 1
      : 0,
    lastUpdate: Date.now(),
    status: 1,
  }));

  // Nếu có phản ứng chưa đồng bộ, tiến hành cập nhật (update) chúng trong store "useActions"
  if (listNotSync.length > 0) {
    await new Promise<void>((resolve, reject) => {
      let updatedCount = 0;

      listNotSync.forEach((item) => {
        const getReq = userActionStore.get(item.questionId);
        getReq.onsuccess = () => {
          const record = getReq.result;
          if (record) {
            // Cập nhật thuộc tính isSynced thành true
            record.isSynced = true;
            const putReq = userActionStore.put(record);
            putReq.onsuccess = () => {
              updatedCount++;
              if (updatedCount === listNotSync.length) {
                resolve();
              }
            };
            putReq.onerror = () => reject(putReq.error);
          } else {
            // Nếu không tìm thấy bản ghi, vẫn tính là update xong
            updatedCount++;
            if (updatedCount === listNotSync.length) {
              resolve();
            }
          }
        };
        getReq.onerror = () => reject(getReq.error);
      });
    });
  }

  return syncReaction;
};

const currentTestPlaying = ({
  progress,
  tests,
}: {
  tests?: ITestBase[];
  progress?: IUserQuestionProgress[];
}): {
  testId: number;
  testSettingId: number;
  lock: number;
  lastUpdate: number;
  status: number;
  totalQuestion: number;
  correctNumber: number;
}[] => {
  // Sử dụng mảng rỗng nếu tests hoặc progress không được cung cấp
  const testsArr = tests || [];
  const progressArr = progress || [];

  // Lọc ra các test có liên quan đến progress (có selectedAnswers nào có parentId trùng với test.id)
  const syncTests = testsArr.filter((t) =>
    progressArr.some((p) =>
      p.selectedAnswers.some((ans) => ans.parentId === t.id)
    )
  );

  // Với mỗi test được đồng bộ, tính số lượng đáp án đúng từ progress và trả về object tương ứng
  return syncTests.map((t) => {
    const correct = progressArr.filter((p) =>
      p.selectedAnswers.some((ans) => ans.correct && ans.parentId === t.id)
    ).length;

    return {
      testId: t.id,
      testSettingId:
        t.gameDifficultyLevel === 'newbie'
          ? 1
          : t.gameDifficultyLevel === 'expert'
          ? 2
          : 3,
      lock: 0,
      lastUpdate: Date.now(),
      // Nếu test có status là 1 thì đặt là 3, nếu có đáp án đúng thì 1, ngược lại là 2
      status: t.status === 1 ? 3 : correct > 0 ? 1 : 2,
      totalQuestion: t.totalQuestion,
      correctNumber: correct,
    };
  });
};

const handleConvertSyncTest = ({
  appId,
  progress,
  questions,
  tests,
  uniqueParentIdList,
  userId,
}: {
  tests?: ITestBase[];
  progress?: IUserQuestionProgress[];
  questions?: IQuestionBase[];
  uniqueParentIdList?: number[];
  userId?: string;
  appId?: number;
}) => {
  // Lọc ra các test có gameMode là customTests hoặc diagnosticTest
  // và có id nằm trong uniqueParentIdList
  const testWithSync = tests?.filter(
    (t) =>
      (t.gameMode === 'customTests' || t.gameMode === 'diagnosticTest') &&
      uniqueParentIdList?.includes(t.id)
  );

  if (!testWithSync || testWithSync.length === 0) return [];

  const syncTests = testWithSync.map((t) => {
    // Lọc ra các progress có selectedAnswers chứa câu trả lời của test hiện tại (dựa theo parentId)
    const answ = progress
      ?.filter((item) => item.selectedAnswers.some((i) => i.parentId === t.id))
      .map((item) => ({
        ...item,
        selectedAnswers: item.selectedAnswers.filter(
          (i) => i.parentId === t.id
        ),
      }));

    // Tính số đáp án đúng bằng cách cộng dồn số selectedAnswers có thuộc tính correct = true
    const correctNumber =
      answ?.reduce(
        (acc, curr) =>
          acc + curr.selectedAnswers.filter((i) => i.correct).length,
        0
      ) || 0;

    return {
      testId: t.id,
      shortId: t.id,
      testSettingId:
        t.gameDifficultyLevel === 'newbie'
          ? 1
          : t.gameDifficultyLevel === 'expert'
          ? 2
          : 3,
      // Với customTests, status lấy từ test, còn đối với diagnosticTest đặt mặc định là 1
      status: t.gameMode === 'customTests' ? t.status : 1,
      totalQuestion: t.totalQuestion,
      correctNumber,
      type: TestConstType[t.gameMode],
      testQuestionData: JSON.stringify(t.groupExamData),
      lastUpdate: Date.now(),
      userId,
      appId,
    };
  });

  console.log('🚀 ~ syncTests:', syncTests);
  return syncTests;
};

const handleConvertSyncQuestion = async ({
  questions,
  userProgressStore,
}: {
  questions?: IUserQuestionProgress[];
  userProgressStore: IDBObjectStore;
}): Promise<any[]> => {
  if (!questions) return [];

  // Gom nhóm các câu hỏi theo key: `${questionId}-${parentId}-${GameTypeStatus}`
  const groupedQuestions = questions.reduce((acc, q) => {
    q.selectedAnswers.forEach((a) => {
      const key = `${q.id}-${a.parentId}-${GameTypeStatus[a.type]}`;
      if (!acc[key]) {
        acc[key] = {
          histories: [],
          questionId: q.id,
          playedTimes: [],
          type: GameTypeStatus[a.type],
          playing: 0,
          lastUpdate: Date.now(),
          parentId: a.parentId,
          choicesSelected: [],
          testIdOrTopicId: a.parentId,
        };
      }
      // Gom nhóm histories (1 nếu đúng, 0 nếu sai)
      acc[key].histories.push(a.correct ? 1 : 0);
      // Gom nhóm choicesSelected, loại bỏ trùng lặp
      if (!acc[key].choicesSelected.includes(a.id)) {
        acc[key].choicesSelected.push(a.id);
      }
      // Gom nhóm playedTimes
      acc[key].playedTimes.push({
        startTime: a.startAt,
        endTime: a.endAt,
      });
    });
    return acc;
  }, {} as Record<string, any>);

  // Chuyển object về array và format playedTimes thành JSON string
  const syncQuestions = Object.values(groupedQuestions).map((q) => ({
    ...q,
    playedTimes: JSON.stringify(q.playedTimes),
  }));

  // Chuẩn bị dữ liệu cập nhật isSynced cho từng record theo question.id
  const data = questions.map((item) => ({
    key: item.id,
    changes: { isSynced: true },
  }));

  // Cập nhật các record trong store "userProgress" sử dụng IndexedDB gốc
  await new Promise<void>((resolve, reject) => {
    let updatedCount = 0;
    if (data.length === 0) {
      resolve();
      return;
    }
    data.forEach((item) => {
      const req = userProgressStore.get(item.key);
      req.onsuccess = () => {
        const record = req.result;
        if (record) {
          // Cập nhật trường isSynced
          record.isSynced = true;
          const putReq = userProgressStore.put(record);
          putReq.onsuccess = () => {
            updatedCount++;
            if (updatedCount === data.length) resolve();
          };
          putReq.onerror = () => reject(putReq.error);
        } else {
          // Nếu không tìm thấy record, vẫn tính là update thành công
          updatedCount++;
          if (updatedCount === data.length) resolve();
        }
      };
      req.onerror = () => reject(req.error);
    });
  });

  return syncQuestions;
};

export {
  getYesterdayMidnightTimestamp,
  convertTopicsFromServer,
  handleReaction,
  handleCreateNewTest,
  fetchRecords,
  mergeAnswers,
  updateUserProgressBulk,
  handleConvertQuestions,
  handleConvertSyncTopic,
  handleConvertSyncReaction,
  currentTestPlaying,
  handleConvertSyncTest,
  handleConvertSyncQuestion,
};
