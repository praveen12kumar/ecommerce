import express from 'express';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import shippingRouter from './routes/shippingRoute.js';
import { errorMiddleware } from './middleware/error.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/', productRouter)
app.use('/api/v1/', userRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1/', shippingRouter);


// Middleware for Errors
app.use(errorMiddleware);

export default app;