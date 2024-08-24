import jwt from 'jsonwebtoken';
import StandardError from 'standard-error';
import validator from 'validator';
import { LOGIN_TOKEN_EXPIRY } from '../../constants/common';
import { Status } from '../../enum/httpStatus';

const JWT_SECRET = process.env.JWT_SECRET;

const getJwtPayload = (user: any) => {
  return {
    valid: true,
    firstName: user.name.first,
    lastName: user.name.last,
    id: user._id.toString(),
    expires: +new Date() + LOGIN_TOKEN_EXPIRY
  };
};

const validateRegisterFields = ({ email, password, oauth, name }: any) => {
  if (!name.first || !name.last) {
    throw new StandardError({ message: 'First and last name is required', code: Status.UNPROCESSABLE_ENTITY });
  }

  if (!validator.matches(`${name.first} ${name.last}`, /^[a-zA-Z ]{2,30}$/)) {
    throw new StandardError({ message: 'Invalid name, valid Charactors include (A-Z) (a-z)', code: Status.UNPROCESSABLE_ENTITY });
  }

  if (!email) {
    throw new StandardError({ message: 'Email is required', code: Status.UNPROCESSABLE_ENTITY });
  }

  if (!validator.isEmail(email)) {
    throw new StandardError({ message: 'Invalid email', code: Status.UNPROCESSABLE_ENTITY });
  }

  if (!password) {
    throw new StandardError({ message: 'Password is required', code: Status.UNPROCESSABLE_ENTITY });
  }

  if (!validator.isStrongPassword(password)) {
    throw new StandardError({ message: 'Password must contain at least 8 characters, including upper and lowercase characters, a number and a special character.', code: Status.UNPROCESSABLE_ENTITY });
  }
};

const validateToken = (token: string) => {
  const decode: any = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return false
    else return decoded
  });
  return decode;
}
export {
  getJwtPayload,
  validateToken,
  validateRegisterFields
}