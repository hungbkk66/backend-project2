import productDao from '../daos/product.dao.js';

const createProductService = async (productData) => {
  const product = await productDao.createProduct(productData);
  return product;
};

const updateProductService = async (id, updateData) => {
  const product = await productDao.updateProduct(id, updateData);
  return product;
};

const deleteProductService = async (id) => {
  const product = await productDao.deleteProduct(id);
  return product;
};

export default {
  createProductService,
  updateProductService,
  deleteProductService,
};
