'use client';
import { ITopicEndTest } from '@ui/container/result';
import { IQuestionOpt } from '@ui/models/question';
import { createContext, ReactNode, useContext } from 'react';

export interface ITableData {
  all: IQuestionOpt[];
  defaultData: IQuestionOpt[];
  correct: IQuestionOpt[];
  incorrect: IQuestionOpt[];
}
interface ResultContextType {
  result: {
    listTopic: ITopicEndTest[];
    all: number;
    correct: number;
    passing: number;
  };
  correctIds: number[];
  tableData: ITableData;
  setTableData: (data: ITableData) => void;
  correct: number;
  total: number;
  isPass: boolean;
  passing: number;
  listTopic: ITopicEndTest[];
}

// Tạo Context
const ResultContext = createContext<ResultContextType | undefined>(undefined);

// Custom Hook để sử dụng Context
export const useResultContext = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResultContext must be used within a ResultProvider');
  }
  return context;
};

// Provider
export const ResultProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: ResultContextType;
}) => {
  return (
    <ResultContext.Provider value={value}>{children}</ResultContext.Provider>
  );
};
