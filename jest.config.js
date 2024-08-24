module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.js'],
  };
  