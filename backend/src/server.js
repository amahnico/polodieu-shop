import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';

import productsRoute from "./routes/products.js";
import ordersRoute from "./routes/orders.js";
import authRoute from "./routes/auth.js";
import paymentRoute from "./routes/payment.js";
app.use("/payment", paymentRoute);
const { PrismaClient } = pkg;

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Polodieu API is running' });
});

app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/auth", authRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});