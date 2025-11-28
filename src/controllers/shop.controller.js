import shopService from '../services/shop.service.js';
import cloudinaryUtils from '../configs/cloudinary.js';

const createShopController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Ảnh sản phẩm là bắt buộc' });
    }
    const imageUrl = await cloudinaryUtils.uploadImage(req.file);
    const shop = await shopService.createShopService({
      ...req.body,
      logo: imageUrl,
    });
    res.status(201).json(shop);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

export default {
  createShopController,
};
