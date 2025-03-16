export type IGameMode =
  | 'finalTests'
  | 'practiceTests'
  | 'diagnosticTest'
  | 'customTests'
  | 'learn'
  | 'branchTest'
  | 'review';
export const TypeParam: Record<IGameMode, IGameMode> = {
  diagnosticTest: 'diagnosticTest',
  finalTests: 'finalTests',
  customTests: 'customTests',
  practiceTests: 'practiceTests',
  review: 'review',
  branchTest: 'branchTest',
  learn: 'learn',
};

export const TypeConstTest: Record<number, IGameMode> = {
  1: TypeParam.practiceTests,
  3: TypeParam.finalTests,
  4: TypeParam.branchTest,
  5: TypeParam.customTests,
  6: TypeParam.diagnosticTest,
};
export const TestConstType: Record<IGameMode, number> = {
  practiceTests: 1,
  finalTests: 2,
  branchTest: 4,
  customTests: 5,
  diagnosticTest: 6,
  review: 7,
  learn: 8,
};
export const GameTypeStatus: Record<IGameMode, number> = {
  learn: 0,
  practiceTests: 1,
  finalTests: 9,
  diagnosticTest: 10,
  customTests: 3,
  // Không dùng trên app
  branchTest: 12,
  review: 13,
} as const;
