import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import shopRoute from './routes/shop.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';
import categoryRoute from './routes/category.route.js';
import { v2 as cloudinary } from 'cloudinary';
import productRoute from './routes/product.route.js';
import cartRoute from './routes/cart.route.js';

const app = express();
const PORT = process.env.PORT || 3678;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/shops', shopRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/shops', shopRoute);
app.use('/api/carts', cartRoute);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
