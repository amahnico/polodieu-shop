
const ADMIN_HASH = "$2b$10$SJ1VF.kV1bq841V3T64ZaeMt6GiZnI6Uaias9PO5G/QZu//HBJU4y";import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';

import productsRoute from "./routes/products.js";
import ordersRoute from "./routes/orders.js";
import authRoute from "./routes/auth.js";
import paymentRoute from "./routes/payment.js";
import bcrypt from "bcrypt";

const ADMIN_HASH = "$2b$10$SJ1VF.kV1bq841V3T64ZaeMt6GiZnI6Uaias9PO5G/QZu//HBJU4y";
const { PrismaClient } = pkg;

dotenv.config();

const app = express(); // ✅ create app FIRST
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.post("/admin/login", async (req, res) => {
  const { password } = req.body;

  const isValid = await bcrypt.compare(password, ADMIN_HASH);

  if (!isValid) {
    return res.status(401).json({ error: "Wrong password" });
  }

  res.json({ token: "secure-admin-token" });
});
// routes
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/auth", authRoute);
app.use("/payment", paymentRoute); // ✅ now correct place

app.get('/', (req, res) => {
  res.json({ message: 'Polodieu API is running' });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});