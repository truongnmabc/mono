import { axiosRequest } from '../config/axios';
import { reportMistakeApi } from './';
import { API_PATH, IGameType } from '../constant';

// Mock the axiosRequest function
jest.mock('../config/axios', () => ({
  axiosRequest: jest.fn(),
}));

describe('reportMistakeApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should successfully report a mistake', async () => {
    // Mock data
    const mockParams = {
      appId: 123,
      reasons: [1, 2],
      questionId: 456,
      otherReason: 'Test reason',
      gameType: 'allQuestions' as IGameType,
      userId: 789,
      deviceId: '127.0.0.1',
    };

    const mockResponse = { success: true };

    // Mock the axiosRequest implementation
    (axiosRequest as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function
    const result = await reportMistakeApi(mockParams);

    // Verify the result
    expect(result).toEqual(mockResponse);

    // Verify axiosRequest was called with correct parameters
    expect(axiosRequest).toHaveBeenCalledWith({
      url: API_PATH.REPORT_MISTAKE,
      base: 'prop',
      data: {
        appId: mockParams.appId,
        questionId: mockParams.questionId,
        screenshot: '',
        reasons: mockParams.reasons,
        otherReason: mockParams.otherReason,
        version: '0',
        dbVersion: '0',
        gameType: mockParams.gameType,
        platform: 'web',
        userId: mockParams.userId,
        deviceId: mockParams.deviceId,
      },
    });
  });

  it('should handle errors properly', async () => {
    // Mock data
    const mockParams = {
      appId: 123,
      reasons: [1, 2],
      questionId: 456,
      otherReason: 'Test reason',
      gameType: 'allQuestions' as IGameType,
      userId: 789,
      deviceId: '127.0.0.1',
    };

    const mockError = new Error('API Error');

    // Mock the axiosRequest implementation to throw an error
    (axiosRequest as jest.Mock).mockRejectedValue(mockError);

    // Call the function and verify error is logged
    await reportMistakeApi(mockParams);

    // Verify axiosRequest was called
    expect(axiosRequest).toHaveBeenCalled();

    // Verify console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error reporting mistake:',
      mockError
    );
  });

  it('should handle missing optional parameters', async () => {
    // Mock data with missing optional parameters
    const mockParams = {
      appId: 123,
      reasons: [1, 2],
      questionId: 456,
      gameType: 'allQuestions' as IGameType,
      userId: 789,
      deviceId: '127.0.0.1',
    };

    const mockResponse = { success: true };

    // Mock the axiosRequest implementation
    (axiosRequest as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function
    const result = await reportMistakeApi(mockParams);

    // Verify the result
    expect(result).toEqual(mockResponse);

    // Verify axiosRequest was called with correct parameters
    expect(axiosRequest).toHaveBeenCalledWith({
      url: API_PATH.REPORT_MISTAKE,
      base: 'prop',
      data: {
        appId: mockParams.appId,
        questionId: mockParams.questionId,
        screenshot: '',
        reasons: mockParams.reasons,
        otherReason: undefined,
        version: '0',
        dbVersion: '0',
        gameType: mockParams.gameType,
        platform: 'web',
        userId: mockParams.userId,
        deviceId: mockParams.deviceId,
      },
    });
  });
});
