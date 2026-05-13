/** @type {import('jest').Config} */
const config = {
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { module: { type: 'es6' } }],
  },
  coverageReporters: ['cobertura', 'html'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
      },
    ],
  ],

  testPathIgnorePatterns: ['<rootDir>/build'],

  coveragePathIgnorePatterns: ['<rootDir>/spec/.*'],
  testTimeout: 30000,
  // detectOpenHandles: true,
}

export default config
