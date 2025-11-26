import jwt from 'jsonwebtoken';
import userDao from '../daos/user.dao.js';
import { A_WEEK } from '../constants/week.js';
import 'dotenv/config';

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

const setTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: A_WEEK,
  });
};

const loginService = async ({ email, password }) => {
  const user = await userDao.findUser({ email });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    const error = new Error('invalid password');
    error.statusCode = 401;
    throw error;
  }

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return userObj;
};

export default {
  createToken,
  setTokenCookie,
  loginService,
};
