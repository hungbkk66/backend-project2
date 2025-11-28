import Product from '../models/product.model.js';

const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

//find product by name
const findByName = async (name) => {
  const product = await Product.find({
    name: { $regex: name, $options: 'i' }, // i = case-insensitive
  });
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

export default {
  createProduct,
  findByName,
  updateProduct,
  deleteProduct,
};
