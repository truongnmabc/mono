type DbOptions = {
  dbName: string;
  dbVersion: number;
};

export const initData = async ({
  dbName,
  dbVersion,
}: DbOptions): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbName, dbVersion);

    // Xử lý nếu mở DB thất bại
    openRequest.onerror = () => {
      console.error('Error opening IndexedDB in SW:', openRequest.error);
      reject(openRequest.error);
    };

    // Thành công => trả về đối tượng IDBDatabase
    openRequest.onsuccess = async (event) => {
      const request = event.target as IDBOpenDBRequest;
      const db = request.result as IDBDatabase;

      // Mở transaction chỉ đọc trên bảng passingApp để kiểm tra xem đã có dữ liệu hay chưa
      const txRead = db.transaction('passingApp', 'readonly');
      const passingStore = txRead.objectStore('passingApp');
      const countRequest = passingStore.count();

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
              const request = event.target as IDBOpenDBRequest;
              console.error(
                'Error counting data in the passingApp table:',
                request.error
              );
            };
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
        resolve(db);
      };
    };
  });
};
