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

export default {
  createProductController,
  updateProductController,
  getMyProductsController,
  deleteProductController,
};
