import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    rootDir: '.',
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
};

export default config;