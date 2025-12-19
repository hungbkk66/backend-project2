import cartDAO from '../daos/cart.dao.js';
import productDao from '../daos/product.dao.js';

const addToCart = async (userId, productId, quantity = 1) => {
  let cart = await cartDAO.findCartByUser(userId);

  // if cart doesn't exist, create a new one
  if (!cart) {
    cart = await cartDAO.createCart(userId);
  }

  const product = await productDao.findById(productId);
  if (!product) throw new Error('Sản phẩm không tồn tại');

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  // total price
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  await cart.save();

  return await cartDAO.findCartByUser(userId);
};

export default {
  addToCart,
};
