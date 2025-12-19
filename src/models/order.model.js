import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    shippingCost: {
      type: Number,
      default: 0,
    },

    payment: {
      method: {
        type: String,
        enum: ['COD', 'MOMO', 'demo'],
        default: 'COD',
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
      transactionId: {
        type: String, // chỉ dùng nếu UAT trả về transactionId
        default: '',
      },
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'],
      default: 'pending',
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
