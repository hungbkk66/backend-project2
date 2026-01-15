import mongoose from 'mongoose';

/* ===== SUB SCHEMA CHO RATING ===== */
const ratingUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false },
);

const ratingSchema = new mongoose.Schema(
  {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    users: {
      type: [ratingUserSchema],
      default: [],
    },
  },
  { _id: false },
);

/* ===== PRODUCT SCHEMA ===== */
const productSchema = new mongoose.Schema(
  {
    /* ===== FIELD CŨ – GIỮ NGUYÊN ===== */
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    /* ===== FIELD MỚI – RATING ===== */
    rating: {
      type: ratingSchema,
      default: () => ({
        average: 0,
        count: 0,
        users: [],
      }),
    },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
