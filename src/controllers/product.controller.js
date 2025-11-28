import productService from '../services/product.service.js';
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

export default {
  createProductController,
  updateProductController,
};
