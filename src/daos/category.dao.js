import Category from '../models/category.model.js';

const createCategory = async ({ name, parent = null }) => {
  const category = await Category.create({ name, parent });
  return category;
};

export default {
  createCategory,
};
