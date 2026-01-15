import shopService from '../services/shop.service.js';
import cloudinaryUtils from '../configs/cloudinary.js';

const createShopController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Ảnh shop là bắt buộc' });
    }

    const imageUrl = await cloudinaryUtils.uploadImage(req.file);

    const shop = await shopService.createShopService({
      ...req.body,
      owner: req.user._id,
      logo: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

const searchShopsController = async (req, res) => {
  try {
    const address = req.query.address || '';
    const country = req.query.country || '';
    const searchQuery = req.query.searchQuery || '';
    const sortOption = req.query.sortOption || 'updatedAt';
    const page = parseInt(req.query.page) || 1;

    const result = await shopService.searchShops({
      address,
      country,
      searchQuery,
      sortOption,
      page,
    });

    if (result.data.length === 0) {
      return res.status(404).json({
        data: [],
        pagination: { total: 0, page: 1, pages: 1 },
      });
    }

    res.json(result);
  } catch (error) {
    console.log('Search shops error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi: ' + error });
  }
};

const updateShopController = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      owner: req.user._id, // đảm bảo shop thuộc user đang đăng nhập
    };

    if (req.file) {
      const imageUrl = await cloudinaryUtils.uploadImage(req.file);
      updateData.logo = imageUrl;
    }

    const shop = await shopService.updateShopService(id, updateData);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error update shop',
    });
  }
};

const getMyShop = async (req, res) => {
  try {
    const userId = req.user._id;

    const shop = await shopService.getShopByUserId(userId);

    return res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createShopController,
  searchShopsController,
  updateShopController,
  getMyShop,
};
