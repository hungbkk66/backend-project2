import cartService from '../services/cart.service.js';

const addToCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId)
      return res.status(400).json({ message: 'ProductId là bắt buộc' });

    const cart = await cartService.addToCart(userId, productId, quantity || 1);

    res.status(200).json(cart);
  } catch (error) {
    console.log('Add to cart error:', error);
    res.status(500).json({ message: error.message || 'Đã xảy ra lỗi' });
  }
};

const getMyCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartService.getMyCart(userId);

    res.status(200).json(cart);
  } catch (error) {
    console.log('Get my cart error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

const getCartGroupedByShop = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await cartService.groupCartByShop(userId);

    res.json({
      success: true,
      groups,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItemId } = req.params;

    const cart = await cartService.removeItemFromCart(userId, cartItemId);

    return res.json({
      success: true,
      message: 'Remove item from cart successfully',
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  addToCartController,
  getMyCartController,
  getCartGroupedByShop,
  removeItemFromCart,
};
