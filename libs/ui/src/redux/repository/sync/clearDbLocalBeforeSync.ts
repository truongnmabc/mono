import { createAsyncThunk } from '@reduxjs/toolkit';
import { TypeParam } from '@ui/constants';
import { API_PATH } from '@ui/constants/api.constants';
import { db } from '@ui/db';
import { ITestBase } from '@ui/models';
import { axiosRequest } from '@ui/services/config/axios';

export const clearDbLocalBeforeSync = createAsyncThunk(
  'clearDbLocalBeforeSync',
  async () => {
    try {
      // Xóa dữ liệu cũ
      if (db) {
        await Promise.all([
          db.testQuestions.clear(),
          db.userProgress.clear(),
          db.useActions.clear(),
        ]);
      }

      // Gửi yêu cầu API để lấy dữ liệu mới
      const [initTopicResponse, testsResponse] = await Promise.all([
        axiosRequest({ url: API_PATH.SW_TOPIC, method: 'get' }),
        axiosRequest({ url: API_PATH.SW_TESTS, method: 'get' }),
      ]);

      // Kiểm tra dữ liệu trả về
      if (!initTopicResponse.data || !testsResponse.data) {
        throw new Error('Không có dữ liệu từ API');
      }

      // Lọc dữ liệu test (bỏ `diagnosticTest`)
      const filteredTests = testsResponse.data.filter(
        (item: ITestBase) => item.gameMode !== TypeParam.diagnosticTest
      );

      // Lưu dữ liệu vào IndexedDB
      if (db) {
        await Promise.all([
          db.topics.bulkPut(initTopicResponse.data),
          db.testQuestions.bulkPut(filteredTests),
        ]);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Lỗi khi đồng bộ dữ liệu:', error);
      return {
        success: false,
      };
    }
  }
);
