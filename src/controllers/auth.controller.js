import jwt from 'jsonwebtoken';
import authService from '../services/auth.service.js';
import userService from '../services/user.service.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginService({ email, password });
    const token = await authService.createToken(user._id);
    authService.setTokenCookie(res, token);
    res.status(200).json({
      message: 'login successful',
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error login',
    });
  }
};

const tetsLogin = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const onboarding = async (req, res) => {
  try {
    const userId = req.user._id;
    const { location, language, description } = req.body;

    if (!location || !language || !description) {
      return res.status(400).json({
        message: 'All fields are required',
        missingFields: [
          !location && 'location',
          !language && 'language',
          !description && 'nativeLanguage',
        ].filter(Boolean),
      });
    }

    const updateUserController = await userService.updateUserService(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true },
    );
    if (!updateUserController)
      return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ success: true, user: updateUserController });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ success: true, message: 'Logout successful' });
};

export default {
  login,
  tetsLogin,
  onboarding,
  logout,
};
