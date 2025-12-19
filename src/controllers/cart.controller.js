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

export default {
  addToCartController,
};
