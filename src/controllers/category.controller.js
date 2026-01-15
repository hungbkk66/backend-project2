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

const getAllCategoryNames = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategoryNames();

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategoryIdByName = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await categoryService.getCategoryIdByName(categoryName);

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createCategoryController,
  getAllCategoryNames,
  getCategoryIdByName,
};
