import "dotenv/config";
import express from "express";
import cors from "cors";
import pkg from "@prisma/client";
import bcrypt from "bcrypt";

import productsRoute from "./routes/products.js";
import ordersRoute from "./routes/orders.js";
import authRoute from "./routes/auth.js";
import paymentRoute from "./routes/payment.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const app = express();
/*
  🔐 IMPORTANT:
  Replace this hash with the one you generated using hash.js
*/
const ADMIN_HASH = "$2b$10$SJ1VF.kV1bq841V3T64ZaeMt6GiZnI6Uaias9PO5G/QZu//HBJU4y";

app.use(cors());
app.use(express.json());

// ✅ ADMIN LOGIN
app.post("/admin/login", async (req, res) => {
  const { password } = req.body;

  try {
    const isValid = await bcrypt.compare(password, ADMIN_HASH);

    if (!isValid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    res.json({ token: "secure-admin-token" });
  } catch (error) {
    res.status(500).json({ error: "Login error" });
  }
});

// routes
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/auth", authRoute);
app.use("/payment", paymentRoute);

app.get("/", (req, res) => {
  res.json({ message: "Polodieu API is running" });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});