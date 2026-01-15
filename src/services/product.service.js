import productDao from '../daos/product.dao.js';
import categoryDao from '../daos/category.dao.js';

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
};
