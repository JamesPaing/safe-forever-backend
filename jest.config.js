/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tsconfig = require('./tsconfig.json');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
    moduleNameMapper,
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
    roots: ['<rootDir>'], // Specify the root directory for your tests
    verbose: true,
    forceExit: true,
    testMatch: ['**/**/*.test.ts'],
    modulePathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/node_modules/',
        '<rootDir>/src/__test__/__fixtures__/',
        '<rootDir>/__test__/__fixtures__/',
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    collectCoverage: true, // Collect coverage information
    coverageDirectory: 'coverage', // Output directory for coverage files
    coverageReporters: ['text', 'lcov'], // Format of coverage reports
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    // setupFilesAfterEnv: ['<rootDir>/src/db/singleton.ts'],
};
