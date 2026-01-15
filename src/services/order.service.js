import cartDao from '../daos/cart.dao.js';
import orderDao from '../daos/order.dao.js';
import Shop from '../models/shop.model.js';

const SHIPPING_COST = 30000;

const createOrdersFromCartByShop = async (userId, itemIds) => {
  const cart = await cartDao.findCartByUser(userId);
  if (!cart) throw new Error('Cart not found');

  // Lấy các item được checkout
  const selectedItems = cart.items.filter((item) =>
    itemIds.includes(item._id.toString()),
  );

  if (selectedItems.length === 0) {
    throw new Error('No items selected');
  }

  // Group theo shop
  const shopMap = {};

  for (const item of selectedItems) {
    const shopId = item.product.shop._id.toString();

    if (!shopMap[shopId]) {
      shopMap[shopId] = {
        shop: item.product.shop._id,
        items: [],
        itemsTotal: 0,
      };
    }

    shopMap[shopId].items.push({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
    });

    shopMap[shopId].itemsTotal += item.price * item.quantity;
  }

  // Tạo order cho từng shop
  const orders = [];

  for (const shopId in shopMap) {
    const group = shopMap[shopId];

    const order = await orderDao.createOrder({
      owner: userId,
      shop: group.shop,
      items: group.items,
      shippingCost: SHIPPING_COST,
      totalPrice: group.itemsTotal + SHIPPING_COST,
    });

    orders.push(order);
  }

  // Xóa item đã checkout khỏi cart
  cart.items = cart.items.filter(
    (item) => !itemIds.includes(item._id.toString()),
  );

  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  await cartDao.saveCart(cart);

  return orders;
};

const getMyOrders = async (userId) => {
  const orders = await orderDao.findOrdersByUser(userId);
  return orders;
};

const getShopOrders = async (userId) => {
  // 1. Tìm Shop thuộc sở hữu của User này
  const shop = await Shop.findOne({ owner: userId });

  if (!shop) {
    throw new Error('Bạn chưa sở hữu cửa hàng nào.');
  }

  // 2. Lấy danh sách đơn hàng của Shop đó
  const orders = await orderDao.findOrdersByShop(shop._id);

  return orders;
};

const updateOrderStatus = async (orderId, status) => {
  // 1. Kiểm tra status có nằm trong danh sách cho phép không
  const validStatuses = [
    'pending',
    'confirmed',
    'delivered',
    'canceled',
    'received',
  ];
  if (!validStatuses.includes(status)) {
    throw new Error('Trạng thái không hợp lệ');
  }

  // 2. (Tuỳ chọn) Kiểm tra logic chuyển đổi trạng thái
  // Ví dụ: Đã 'delivered' thì không được quay lại 'pending'
  const currentOrder = await orderDao.findOrderById(orderId);
  if (!currentOrder) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  if (currentOrder.status === 'canceled') {
    throw new Error('Đơn hàng đã bị hủy, không thể cập nhật trạng thái khác');
  }

  // 3. Cập nhật
  const updatedOrder = await orderDao.updateOrderStatus(orderId, status);
  return updatedOrder;
};

export default {
  createOrdersFromCartByShop,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
};
