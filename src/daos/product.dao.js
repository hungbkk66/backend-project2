import Product from '../models/product.model.js';

const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

const findById = async (id) => {
  return Product.findById(id)
    .populate('category', 'name')
    .populate('shop', 'name');
};

const findByIdWithShop = (productId) => {
  return Product.findById(productId).populate('shop', 'owner');
};

const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return product;
};
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  return product;
};

const findByShopId = async (shopId) => {
  const products = await Product.find({ shop: shopId });
  return products;
};

const searchProducts = async ({ keyword, categoryIds }) => {
  const query = {};

  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }

  if (categoryIds && categoryIds.length > 0) {
    query.category = { $in: categoryIds };
  }

  return await Product.find(query)
    .populate('category', 'name')
    .populate('shop', 'name logo')
    .sort({ createdAt: -1 });
};

const save = async (product) => {
  return product.save();
};

const getTopExpensiveProducts = async (limit = 20) => {
  return Product.find().sort({ price: -1 }).limit(limit);
};

const getTopCheapestProducts = async (limit = 20) => {
  return Product.find().sort({ price: 1 }).limit(limit);
};

const getProductsByCategoryIds = async (categoryIds) => {
  return Product.find({
    category: { $in: categoryIds },
  }).populate('category');
};

const findTopRatedProducts = async () => {
  return await Product.find()
    // SỬA DÒNG NÀY: Sort theo 'rating.average'
    // Thêm count: -1 để nếu cùng điểm trung bình thì ai nhiều vote hơn sẽ xếp trên
    .sort({ 'rating.average': -1, 'rating.count': -1 })
    .limit(20)
    .populate('shop', 'name logo') // Giả sử Shop schema có field name và logo
    .populate('category', 'name'); // Giả sử Category schema có field name
};

export default {
  createProduct,
  findById,
  findByIdWithShop,
  updateProduct,
  deleteProduct,
  findByShopId,
  searchProducts,
  save,
  getTopExpensiveProducts,
  getTopCheapestProducts,
  getProductsByCategoryIds,
  findTopRatedProducts,
};
