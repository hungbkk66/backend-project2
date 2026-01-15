import Order from '../models/order.model.js';

const createOrder = async (data) => {
  return await Order.create(data);
};

const findOrdersByUser = async (userId) => {
  return await Order.find({ owner: userId })
    .populate('shop', 'name logo')
    .populate('items.product', 'name imageUrl price')
    .sort({ createdAt: -1 });
};

const findOrdersByShop = async (shopId) => {
  return await Order.find({ shop: shopId })
    // Populate thông tin người mua (tên, avatar, sđt...)
    .populate('owner', 'name email phone avatar')

    // Populate thông tin sản phẩm
    .populate({
      path: 'items.product',
      select: 'name imageUrl price',
    })
    .sort({ createdAt: -1 }); // Mới nhất lên đầu
};

const updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status: status },
    {
      new: true, // Trả về document sau khi update
      runValidators: true, // Bắt buộc kiểm tra xem status có nằm trong enum không
    },
  );
};

const findOrderById = async (orderId) => {
  return await Order.findById(orderId);
};

export default {
  createOrder,
  findOrdersByUser,
  findOrdersByShop,
  updateOrderStatus,
  findOrderById,
};
