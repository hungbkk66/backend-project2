import Product from '../models/product.model.js';

const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

const findById = async (id) => {
  const product = await Product.findById(id);
  return product;
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

export default {
  createProduct,
  findById,
  updateProduct,
  deleteProduct,
  findByShopId,
};
