import categoryService from '../services/category.service.js';

const createCategoryController = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const category = await categoryService.createCategoryService({
      name,
      parent,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error create category',
    });
  }
};

export default {
  createCategoryController,
};
