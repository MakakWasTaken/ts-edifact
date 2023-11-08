/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
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

  coveragePathIgnorePatterns: [
    '<rootDir>/spec/.*',
  ],
  testTimeout: 30000,
  // detectOpenHandles: true,
}
