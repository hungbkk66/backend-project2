import orderService from '../services/order.service.js';
import Order from '../models/order.model.js'; // Import Model để update status khi webhook gọi về
import axios from 'axios';
import crypto from 'crypto';

// --- CẤU HÌNH MOMO (Lấy từ .env) ---
const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;
const MOMO_ENDPOINT = 'https://test-payment.momo.vn/v2/gateway/api/create';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Lưu ý: IPN URL phải là đường dẫn Public (dùng Ngrok nếu test localhost)
const MOMO_IPN_URL = process.env.MOMO_IPN_URL;

// --- HELPER: Tạo chữ ký MoMo ---
const generateSignature = (rawSignature, secretKey) => {
  return crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
};

// ==========================================
// 1. TẠO ĐƠN HÀNG & LẤY LINK THANH TOÁN
// ==========================================
const createOrdersFromCartByShop = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({
        success: false,
        message: 'itemIds is required',
      });
    }

    // A. Gọi Service để tạo đơn hàng trong DB (Logic cũ của bạn)
    // orders lúc này là mảng các đơn hàng (do tách theo shop) có status 'pending'
    const orders = await orderService.createOrdersFromCartByShop(
      userId,
      itemIds,
    );

    // --- BẮT ĐẦU LOGIC MOMO TỪ ĐÂY ---

    // B. Tính tổng tiền của tất cả các đơn hàng vừa tạo
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    // C. Chuẩn bị dữ liệu gửi sang MoMo
    // Lấy ID của đơn hàng đầu tiên làm mã giao dịch đại diện
    const orderId = orders[0]._id.toString();
    const requestId = orderId + new Date().getTime();
    const orderInfo = 'Thanh toan don hang Shop Online';
    const redirectUrl = `${FRONTEND_URL}/payment-result`; // Trang kết quả ở Frontend
    const ipnUrl = MOMO_IPN_URL;
    const requestType = 'captureWallet';

    // Gom tất cả ID đơn hàng vào extraData (Mã hóa Base64) để Webhook biết cần update đơn nào
    const allOrderIds = orders.map((o) => o._id.toString());
    const extraData = Buffer.from(JSON.stringify(allOrderIds)).toString(
      'base64',
    );

    // Tạo chữ ký
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${totalAmount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${requestId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = generateSignature(rawSignature, MOMO_SECRET_KEY);

    // Body request
    const requestBody = {
      partnerCode: MOMO_PARTNER_CODE,
      accessKey: MOMO_ACCESS_KEY,
      requestId: requestId,
      amount: totalAmount,
      orderId: requestId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi',
    };

    // D. Gọi API MoMo
    const momoResponse = await axios.post(MOMO_ENDPOINT, requestBody);

    // E. Trả về kết quả
    if (momoResponse.data && momoResponse.data.payUrl) {
      // Thành công: Trả về orders và payUrl
      res.status(201).json({
        success: true,
        orders,
        payUrl: momoResponse.data.payUrl,
      });
    } else {
      // Thất bại phía MoMo: Vẫn trả về success=true vì đơn hàng đã tạo trong DB
      // Nhưng không có payUrl -> Frontend sẽ redirect về trang đơn hàng thay vì MoMo
      console.error('MoMo Error:', momoResponse.data);
      res.status(201).json({
        success: true,
        orders,
        message: 'Đơn hàng đã tạo nhưng lỗi kết nối thanh toán.',
        payUrl: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 2. WEBHOOK XỬ LÝ KẾT QUẢ (IPN)
// ==========================================
const momoWebhookHandler = async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    // Kiểm tra chữ ký để đảm bảo request từ MoMo
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const generatedSignature = generateSignature(rawSignature, MOMO_SECRET_KEY);

    if (signature !== generatedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Nếu thanh toán thành công (resultCode = 0)
    if (resultCode == 0) {
      // Giải mã extraData lấy danh sách Order ID
      const decodedExtraData = Buffer.from(extraData, 'base64').toString(
        'utf-8',
      );
      const orderIds = JSON.parse(decodedExtraData);

      // Update trạng thái 'paid' cho các đơn hàng đó
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { status: 'paid' } }, // Hoặc trạng thái khác tuỳ logic shop bạn
      );
      console.log(`Updated orders to PAID: ${orderIds}`);
    }

    return res.status(204).json({});
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ==========================================
// 3. LẤY DANH SÁCH ĐƠN HÀNG (Giữ nguyên)
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderService.getMyOrders(userId);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng',
    });
  }
};

const getShopOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderService.getShopOrders(userId);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy đơn hàng của shop',
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Lấy orderId từ URL
    const { status } = req.body; // Lấy status mới từ body

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu Order ID hoặc Status',
      });
    }

    const updatedOrder = await orderService.updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createOrdersFromCartByShop,
  getMyOrders,
  momoWebhookHandler,
  getShopOrders,
  updateOrderStatus,
};
