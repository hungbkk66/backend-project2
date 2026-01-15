import categoryDao from '../daos/category.dao.js';

const createCategoryService = async (categoryData) => {
  const category = await categoryDao.createCategory(categoryData);
  return category;
};

const getAllCategoryNames = async () => {
  return await categoryDao.findAllCategoryNames();
};

const getCategoryIdByName = async (categoryName) => {
  const category = await categoryDao.findCategoryByName(categoryName);

  if (!category) {
    throw new Error('Category not found');
  }

  return {
    _id: category._id,
    name: category.name,
  };
};

export default {
  createCategoryService,
  getAllCategoryNames,
  getCategoryIdByName,
};
