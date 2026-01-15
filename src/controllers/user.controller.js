import userService from '../services/user.service.js';
import authService from '../services/auth.service.js';

const createUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const user = await userService.createUserService({
      name,
      email,
      password,
      phone,
      profilePic: randomAvatar,
    });
    const token = await authService.createToken(user._id);
    authService.setTokenCookie(res, token);
    res.status(201).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error create user',
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await userService.updateUserService(id, updateData);

    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error update user',
    });
  }
};

export default {
  createUserController,
  updateUserController,
};
