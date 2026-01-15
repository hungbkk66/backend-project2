import mongoose from 'mongoose';
import User from '../models/user.model.js';
const { ObjectId } = mongoose.Types;

const createUser = async ({ name, email, password, phone, profilePic }) => {
  const user = await User.create({ name, email, password, phone, profilePic });
  return user;
};

const findUser = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const user = await User.findById(condition);
    return user;
  }

  if (typeof condition === 'object' && condition !== null) {
    const user = await User.findOne(condition);
    return user;
  }

  return null;
};

const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

export default {
  createUser,
  findUser,
  updateUser,
  deleteUser,
};
