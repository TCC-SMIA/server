const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/domains/**/services/*.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: [
        "text-summary",
        "lcov",
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),
    preset: 'ts-jest',
    testEnvironment: "node",
    testMatch: [
        "**/*.spec.ts",
        "**/*.test.ts"
    ],
    coverageThreshold: {
        global: {
            statements: 90,
            branches: 90,
            functions: 90,
            lines: 90,
        },
    },
};