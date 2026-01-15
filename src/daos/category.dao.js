import Category from '../models/category.model.js';

const createCategory = async ({ name, parent = null }) => {
  const category = await Category.create({ name, parent });
  return category;
};

const findByName = async (name) => {
  return Category.findOne({
    name: { $regex: name, $options: 'i' },
  });
};

const getCategoryAndChildrenIds = async (categoryName) => {
  const parentCategory = await Category.findOne({ name: categoryName });
  if (!parentCategory) return [];

  const children = await Category.find({ parent: parentCategory._id });

  return [parentCategory._id, ...children.map((c) => c._id)];
};

const findChildrenByParentId = async (parentId) => {
  return await Category.find({ parent: parentId });
};

const findAllCategoryNames = async () => {
  return await Category.find({}, 'name').sort({ name: 1 });
};

const findCategoryByName = async (name) => {
  return await Category.findOne({ name });
};

export default {
  createCategory,
  findByName,
  getCategoryAndChildrenIds,
  findChildrenByParentId,
  findAllCategoryNames,
  findCategoryByName,
};
