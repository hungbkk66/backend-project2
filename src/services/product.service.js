import productDao from '../daos/product.dao.js';
import categoryDao from '../daos/category.dao.js';
import Product from '../models/product.model.js';
import orderDao from '../daos/order.dao.js';

const createProductService = async (productData) => {
  const product = await productDao.createProduct(productData);
  return product;
};

const updateProductService = async (id, updateData) => {
  const product = await productDao.updateProduct(id, updateData);
  return product;
};

const deleteProductService = async (id) => {
  const product = await productDao.deleteProduct(id);
  return product;
};

const getProductsByShopId = async (shopId) => {
  const products = await productDao.findByShopId(shopId);
  return products;
};

const searchProducts = async ({ keyword, category }) => {
  let categoryIds = null; // Mặc định là null (nghĩa là không lọc theo category)

  // Nếu người dùng có chọn Category
  if (category) {
    const parentCategory = await categoryDao.findByName(category);

    if (parentCategory) {
      // Tìm các category con của nó
      const children = await categoryDao.findChildrenByParentId(
        parentCategory._id,
      );

      // Gộp ID cha và các ID con lại
      categoryIds = [parentCategory._id, ...children.map((c) => c._id)];
    } else {
      // Trường hợp người dùng nhập tên category linh tinh không tồn tại trong DB
      // Gán mảng rỗng để tí nữa query trả về 0 kết quả (thay vì trả về all)
      categoryIds = [];
    }
  }

  // Gọi xuống DAO
  return await productDao.searchProducts({
    keyword,
    categoryIds,
  });
};

const getProductById = async (id) => {
  const product = await productDao.findById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

const rateProduct = async ({ productId, userId, star }) => {
  const product = await productDao.findByIdWithShop(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // ❌ shop owner KHÔNG được rate sản phẩm của mình
  if (product.shop.owner.toString() === userId) {
    throw new Error('Shop owner cannot rate own product');
  }

  // 🛡️ xử lý product cũ chưa có rating
  if (!product.rating) {
    product.rating = {
      average: 0,
      count: 0,
      users: [],
    };
  }

  // 🔍 kiểm tra user đã rate chưa
  const ratedUser = product.rating.users.find(
    (u) => u.user.toString() === userId,
  );

  if (ratedUser) {
    ratedUser.star = star;
  } else {
    product.rating.users.push({
      user: userId,
      star,
    });
  }

  // 🔢 tính lại rating
  const totalStar = product.rating.users.reduce((sum, u) => sum + u.star, 0);

  product.rating.count = product.rating.users.length;
  product.rating.average = Number(
    (totalStar / product.rating.count).toFixed(1),
  );

  await productDao.save(product);

  return product.rating;
};

const getTopExpensiveProducts = async () => {
  return await productDao.getTopExpensiveProducts(20);
};

const getTopCheapestProducts = async () => {
  return await productDao.getTopCheapestProducts(20);
};

const getProductsByCategoryName = async (categoryName) => {
  const categoryIds = await categoryDao.getCategoryAndChildrenIds(categoryName);

  return await productDao.getProductsByCategoryIds(categoryIds);
};

const getTopRatedProducts = async () => {
  return await productDao.findTopRatedProducts();
};

const addProductRating = async ({ userId, productId, orderId, star }) => {
  // 1. Kiểm tra đơn hàng có tồn tại và đã nhận hàng chưa
  const order = await orderDao.findOrderById(orderId);
  if (!order) throw new Error('Đơn hàng không tồn tại');

  if (order.owner.toString() !== userId.toString()) {
    throw new Error('Bạn không có quyền đánh giá đơn hàng này');
  }

  if (order.status !== 'received') {
    throw new Error('Bạn chỉ có thể đánh giá sau khi đã xác nhận nhận hàng');
  }

  // 2. Tìm sản phẩm
  const product = await Product.findById(productId);
  if (!product) throw new Error('Sản phẩm không tồn tại');

  // 3. Kiểm tra xem user này đã đánh giá sản phẩm này chưa
  const existingRatingIndex = product.rating.users.findIndex(
    (r) => r.user.toString() === userId.toString(),
  );

  if (existingRatingIndex !== -1) {
    // A. Nếu đã đánh giá rồi -> Cập nhật lại số sao
    product.rating.users[existingRatingIndex].star = star;
  } else {
    // B. Nếu chưa -> Thêm đánh giá mới (chỉ user và star)
    product.rating.users.push({
      user: userId,
      star: star,
    });
  }

  // 4. Tính toán lại Average Rating và Count
  const totalStars = product.rating.users.reduce(
    (acc, item) => acc + item.star,
    0,
  );
  const reviewCount = product.rating.users.length;

  product.rating.count = reviewCount;
  // Tính trung bình, làm tròn 1 số lẻ (VD: 4.5)
  product.rating.average =
    reviewCount === 0 ? 0 : Number((totalStars / reviewCount).toFixed(1));

  // 5. Lưu lại Product
  await product.save();

  return product;
};

export default {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductsByShopId,
  searchProducts,
  getProductById,
  rateProduct,
  getTopExpensiveProducts,
  getTopCheapestProducts,
  getProductsByCategoryName,
  getTopRatedProducts,
  addProductRating,
};
