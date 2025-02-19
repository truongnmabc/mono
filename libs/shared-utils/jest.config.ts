import { preset } from '../../jest.preset';

export default {
  displayName: 'util',
  preset: preset,
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/util',
  extensionsToTreatAsEsm: ['.ts'],
};
