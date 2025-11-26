import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import shopRoute from './routes/shop.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3678;
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

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
