self.addEventListener('install', (event) => {
  console.log('Service Worker installed.', event);
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.', event);
});

let db;
const initData = async () => {
  const dbName = 'asvab';
  const dbVersion = 1;
  const openRequest = indexedDB.open(dbName, dbVersion);

  openRequest.onerror = (event) => {
    console.error('Error opening IndexedDB in SW:', event.target.error);
  };

  openRequest.onsuccess = (event) => {
    db = event.target.result;
    // Mở transaction chỉ đọc trên bảng passingApp để kiểm tra xem đã có dữ liệu hay chưa
    const txRead = db.transaction('passingApp', 'readonly');
    const passingStore = txRead.objectStore('passingApp');
    const countRequest = passingStore.count();
    const generateSyncKey = () => {
      const now = new Date();

      // Lấy năm, tháng, ngày, phút hiện tại
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
      const day = String(now.getDate()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      // Format thành "WEB.YYYYMMDD-mm"
      return `WEB-${year}${month}${day}-${minutes}`;
    };
    countRequest.onsuccess = async () => {
      const count = countRequest.result;
      if (count > 0) {
        console.log('Data already exists in IndexedDB, skipping fetch API.');
      } else {
        // Nếu chưa có dữ liệu, tiến hành fetch API
        try {
          const [passingData, testsData, topicsData] = await Promise.all([
            fetch('/api/sw/passing').then((res) => res.json()),
            fetch('/api/sw/tests').then((res) => res.json()),
            fetch('/api/sw/topics').then((res) => res.json()),
          ]);

          // Tính số trang cho questions dựa vào totalQuestions từ passingData
          const totalQuestions = passingData.totalQuestion;
          const limit = 200;
          const numPages = Math.ceil(totalQuestions / limit);

          // Fetch dữ liệu questions theo từng trang
          const questionsPages = await Promise.all(
            Array.from({ length: numPages }, (_, index) =>
              fetch(`/api/sw/question/${index}`).then((res) => res.json())
            )
          );

          // Mở transaction ghi cho các object store cần lưu dữ liệu
          const txWrite = db.transaction(
            ['passingApp', 'testQuestions', 'topics', 'questions'],
            'readwrite'
          );

          // Lưu dữ liệu vào bảng passingApp
          txWrite.objectStore('passingApp').put({
            ...passingData,
            syncKey: generateSyncKey(),
          });

          // Lưu dữ liệu vào bảng testQuestions
          const testsStore = txWrite.objectStore('testQuestions');
          if (Array.isArray(testsData)) {
            testsData.forEach((item) => testsStore.put(item));
          } else {
            testsStore.put(testsData);
          }

          // Lưu dữ liệu vào bảng topics
          const topicsStore = txWrite.objectStore('topics');
          if (Array.isArray(topicsData)) {
            topicsData.forEach((item) => topicsStore.put(item));
          } else {
            topicsStore.put(topicsData);
          }

          // Lưu dữ liệu vào bảng questions (giả sử mỗi trang là một mảng các câu hỏi)
          const questionsStore = txWrite.objectStore('questions');
          questionsPages.forEach((page) => {
            if (Array.isArray(page)) {
              page.forEach((item) => questionsStore.put(item));
            } else {
              questionsStore.put(page);
            }
          });

          txWrite.oncomplete = () => {
            console.log('All data has been saved to IndexedDB successfully.');
          };

          txWrite.onerror = (event) => {
            console.error(
              'Error saving data to IndexedDB:',
              event.target.error
            );
          };
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    countRequest.onerror = (event) => {
      console.error(
        'Error counting data in the passingApp table:',
        event.target.error
      );
    };
  };
};

const syncUp = async () => {
  console.log('SYNC_UP');
};

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

const syncDown = async ({ syncKey, appId, userId }) => {
  try {
    const timestamp = getYesterdayMidnightTimestamp();

    const payload = {
      appId,
      userId,
      deleteOldData: false,
      user_data: {
        userId,
        syncKey,
        appId,
        mapUpdateData: {
          QuestionProgress: timestamp,
          UserQuestionProgress: timestamp,
          TestInfo: timestamp,
          UserTestData: timestamp,
          TopicProgress: timestamp,
        },
      },
    };

    const response = await fetch(
      'https://micro-enigma-235001.appspot.com/api/app/flutter?type=get-user-data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    // Kiểm tra status code
    if (!response.ok) {
      throw new Error(`Server trả về mã lỗi: ${response.status}`);
    }
    // Lấy dữ liệu từ server (nếu server trả JSON)
    const data = await response.json();
    const {
      UserQuestionProgress,
      TestInfo,
      QuestionProgress,
      TopicProgress,
      UserTestData,
    } = data;
    const tx = db.transaction('topics', 'readwrite');
    const topicsStore = tx.objectStore('topics');
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

    await topicsStore.done;
  } catch (err) {
    console.error('syncDown error:', err);
    throw err;
  }
};

self.addEventListener('message', async (event) => {
  if (event.data.type === 'INIT_DB') {
    await initData();
    event.ports[0].postMessage({
      status: 'success',
      message: 'DB initialized and data fetched (if not already present).',
    });
  }
  if (event.data.type === 'SYNC_UP') {
    await syncUp();
  }
  if (event.data.type === 'SYNC_DOWN') {
    const { syncKey, appId, userId } = event.data.payload;

    await syncDown({ syncKey, appId, userId });
  }
});
