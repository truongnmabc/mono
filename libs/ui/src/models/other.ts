type ITopicHomeJson = {
  id: number;
  name: string;
  icon: string;
  slug?: string;
  orderIndex: number;
  topics?: ITopicHomeJson[];
};
type IBranchHomeJson = {
  id: string;
  list: IList[];
};

export type { IBranchHomeJson, ITopicHomeJson };

export interface ITestsHomeJson {
  finalTests: FinalTests;
  practiceTests: IPracticeTestsHomeJson;
  diagnosticTest: DiagnosticTest;
  branchTest: IBranchHomeJson;
}

export interface FinalTests {
  id: string;
  testId: number;
}

export interface IPracticeTestsHomeJson {
  id: string;
  list: IList[];
}

interface IList {
  id: number;
  name: string;
  slug: string;
}

export interface DiagnosticTest {
  id: string;
  testId: number;
}

export interface List2 {
  id: number;
  name: string;
  slug: string;
}

export type IThunkFunctionReturn<T> = {
  payload: T;
  type: string;
  meta: {
    requestId: string;
    requestStatus: 'fulfilled' | 'rejected';
  };
};

export type IModeReview = 'weak' | 'hard' | 'saved' | 'all' | 'random';
