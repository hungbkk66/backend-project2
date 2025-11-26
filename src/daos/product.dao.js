import Product from '../models/product.model.js';

const createProduct = async ({
  name,
  imageUrl,
  description,
  price,
  category,
  stock,
}) => {
  const product = await Product.create({
    name,
    imageUrl,
    description,
    price,
    category,
    stock,
  });
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
  // Implementation for updating a product can be added here
};
const deleteProduct = async (id) => {
  // Implementation for deleting a product can be added here
};

export default {
  createProduct,
  findByName,
  updateProduct,
  deleteProduct,
};
