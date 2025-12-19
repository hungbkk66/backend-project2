import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'pending'],
      default: 'pending',
    },
    logo: {
      type: String,
      required: true,
    },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
