import shopDao from '../daos/shop.dao.js';

const createShopService = async (shopData) => {
  const shop = await shopDao.createShop(shopData);
  return shop;
};

export default {
  createShopService,
};
