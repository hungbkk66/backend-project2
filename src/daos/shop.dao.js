import Shop from '../models/shop.model.js';

const createShop = async (shopData) => {
  const shop = await Shop.create(shopData);
  return shop;
};

export default {
  createShop,
};
