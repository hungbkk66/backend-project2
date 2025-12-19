import Shop from '../models/shop.model.js';

const createShop = async (shopData) => {
  const shop = await Shop.create(shopData);
  return shop;
};

const findShops = async (
  query,
  sortOption = 'updatedAt',
  page = 1,
  pageSize = 10,
) => {
  const skip = (page - 1) * pageSize;

  const shops = await Shop.find(query)
    .sort({ [sortOption]: 1 })
    .skip(skip)
    .limit(pageSize)
    .lean();

  const total = await Shop.countDocuments(query);

  return { shops, total };
};

const updateShop = async (id, updateData) => {
  const shop = await Shop.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  );

  return shop;
};

const findShopByUserId = async (userId) => {
  return await Shop.findOne({ owner: userId });
};

export default {
  createShop,
  findShops,
  updateShop,
  findShopByUserId,
};
