import cartDAO from '../daos/cart.dao.js';
import productDao from '../daos/product.dao.js';

const addToCart = async (userId, productId, quantity = 1) => {
  let cart = await cartDAO.findCartByUser(userId);

  if (!cart) {
    cart = await cartDAO.createCart(userId);
  }

  const product = await productDao.findById(productId);
  if (!product) throw new Error('Sản phẩm không tồn tại');

  const existingItem = cart.items.find((item) => {
    if (!item.product) return false;
    return item.product._id.toString() === productId.toString();
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  await cart.save();

  return await cartDAO.findCartByUser(userId);
};

const getMyCart = async (userId) => {
  const cart = await cartDAO.findCartByUser(userId);

  if (!cart) {
    return {
      items: [],
      totalPrice: 0,
    };
  }

  return cart;
};

const groupCartByShop = async (userId) => {
  const cart = await cartDAO.findCartByUser(userId);

  if (!cart || cart.items.length === 0) {
    return [];
  }

  const shopMap = {};

  for (const item of cart.items) {
    const product = item.product;
    const shop = product.shop;
    const shopId = shop._id.toString();

    if (!shopMap[shopId]) {
      shopMap[shopId] = {
        shop: {
          _id: shop._id,
          name: shop.name,
          logo: shop.logo,
        },
        items: [],
        shopTotal: 0,
      };
    }

    shopMap[shopId].items.push({
      _id: item._id, // cartItemId
      product: product, // đã populate
      quantity: item.quantity,
      price: item.price,
    });

    shopMap[shopId].shopTotal += item.price * item.quantity;
  }

  return Object.values(shopMap);
};

const removeItemFromCart = async (userId, cartItemId) => {
  const cart = await cartDAO.findCartByUser(userId);

  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === cartItemId,
  );

  if (itemIndex === -1) {
    throw new Error('Cart item not found');
  }

  // Trừ totalPrice
  const item = cart.items[itemIndex];
  cart.totalPrice -= item.price * item.quantity;

  // Xóa item
  cart.items.splice(itemIndex, 1);

  await cart.save();

  return cart;
};

export default {
  addToCart,
  getMyCart,
  groupCartByShop,
  removeItemFromCart,
};
