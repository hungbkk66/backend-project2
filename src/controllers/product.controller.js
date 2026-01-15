import productService from '../services/product.service.js';
import shopService from '../services/shop.service.js';
import cloudinaryUtils from '../configs/cloudinary.js';

const createProductController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Ảnh sản phẩm là bắt buộc' });
    }
    const imageUrl = await cloudinaryUtils.uploadImage(req.file);
    const product = await productService.createProductService({
      ...req.body,
      imageUrl: imageUrl,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await cloudinaryUtils.uploadImage(req.file);
      updateData.imageUrl = imageUrl;
    }

    const updatedProduct = await productService.updateProductService(
      id,
      updateData,
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log('Update product error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

const getMyProductsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const shop = await shopService.getShopByUserId(userId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'User has no shop',
      });
    }

    const products = await productService.getProductsByShopId(shop._id);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log('Get my products error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productService.deleteProductService(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    console.log('Delete product error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

const searchProductsController = async (req, res) => {
  try {
    // Lấy keyword và category từ query URL (?keyword=abc&category=laptop)
    const { keyword, category } = req.query;

    const products = await productService.searchProducts({
      keyword,
      category, // Truyền đúng tên biến
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi server' });
  }
};

const getProductDetailController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const rateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { star } = req.body;
    const userId = req.user._id;

    if (!star || star < 1 || star > 5) {
      return res.status(400).json({
        message: 'Star must be between 1 and 5',
      });
    }

    const rating = await productService.rateProduct({
      productId,
      userId,
      star,
    });

    res.status(200).json({
      message: 'Rating successful',
      rating,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getTopExpensiveProducts = async (req, res) => {
  try {
    const products = await productService.getTopExpensiveProducts();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get expensive products',
    });
  }
};

const getTopCheapestProducts = async (req, res) => {
  try {
    const products = await productService.getTopCheapestProducts();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cheapest products',
    });
  }
};

const getProductsByCategoryName = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const products =
      await productService.getProductsByCategoryName(categoryName);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to get products by category',
    });
  }
};

const getTopRatedProducts = async (req, res) => {
  try {
    const products = await productService.getTopRatedProducts();

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createProductController,
  updateProductController,
  getMyProductsController,
  deleteProductController,
  searchProductsController,
  getProductDetailController,
  rateProduct,
  getTopExpensiveProducts,
  getTopCheapestProducts,
  getProductsByCategoryName,
  getTopRatedProducts,
};
