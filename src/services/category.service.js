import categoryDao from '../daos/category.dao.js';

const createCategoryService = async (categoryData) => {
  const category = await categoryDao.createCategory(categoryData);
  return category;
};

export default {
  createCategoryService,
};
