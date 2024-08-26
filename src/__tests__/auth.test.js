const StandardError = require('standard-error');
const { validateRegisterFields } = require('../../dist/routes/auth/helper');

jest.mock('validator', () => ({
  isEmail: jest.fn(),
  matches: jest.fn(),
  isStrongPassword: jest.fn(),
}));

describe('validateRegisterFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the first or last name is missing', () => {
    const user = { email: 'test@example.com', password: 'Password123!', name: { first: '', last: '' } };

    expect(() => validateRegisterFields(user)).toThrow(StandardError);
    expect(() => validateRegisterFields(user)).toThrow('First and last name is required');
  });

  it('throws an error if email is missing', () => {
    const user = { email: '', password: 'Password123!', name: { first: 'User', last: 'Test' } };

    expect(() => validateRegisterFields(user)).toThrow(StandardError);
    expect(() => validateRegisterFields(user)).toThrow('Email is required');
  });

  it('throws an error if password is missing', () => {
    const user = { email: 'test@example.com', password: '', name: { first: 'User', last: 'Test' } };

    expect(() => validateRegisterFields(user)).toThrow(StandardError);
    expect(() => validateRegisterFields(user)).toThrow('Password is required');
  });
});
