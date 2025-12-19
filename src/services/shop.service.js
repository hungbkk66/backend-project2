import shopDao from '../daos/shop.dao.js';

const createShopService = async (shopData) => {
  const shop = await shopDao.createShop(shopData);
  return shop;
};

const searchShops = async ({
  address = '',
  country = '',
  searchQuery = '',
  sortOption = 'updatedAt',
  page = 1,
}) => {
  const query = {};

  // filter theo address
  if (address) {
    query.address = new RegExp(address, 'i');
  }

  // filter theo country
  if (country) {
    query.country = new RegExp(country, 'i');
  }

  // search theo name hoặc address
  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery, 'i');
    query.$or = [{ name: searchRegex }, { address: searchRegex }];
  }

  const pageSize = 10;
  const { shops, total } = await shopDao.findShops(
    query,
    sortOption,
    page,
    pageSize,
  );

  return {
    data: shops,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / pageSize),
    },
  };
};

const updateShopService = async (id, updateData) => {
  const shop = await shopDao.updateShop(id, updateData);
  return shop;
};

const getShopByUserId = async (userId) => {
  if (!userId) {
    throw new Error('UserId is required');
  }

  const shop = await shopDao.findShopByUserId(userId);

  if (!shop) {
    throw new Error('Shop not found');
  }

  return shop;
};

export default {
  createShopService,
  searchShops,
  updateShopService,
  getShopByUserId,
};
