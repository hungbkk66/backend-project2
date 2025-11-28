import userDao from '../daos/user.dao.js';

const createUserService = async (userData) => {
  const existingUser = await userDao.findUser({ email: userData.email });
  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await userDao.createUser(userData);
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return userObj;
};

const updateUserService = async (userId, updateData) => {
  // Nếu đang update password → hash lại
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const user = await userDao.updateUser(userId, updateData);

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;

  return userObj;
};

export default {
  createUserService,
  updateUserService,
};
