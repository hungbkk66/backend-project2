import Cart from '../models/cart.model.js';

const findCartByUser = async (userId) => {
  return await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    populate: { path: 'shop', select: 'name logo' }, // populate shop từ product
  });
};

const createCart = async (userId) => {
  const cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const updateCart = async (cartId, updateData) => {
  return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
};

export default {
  findCartByUser,
  createCart,
  updateCart,
};
