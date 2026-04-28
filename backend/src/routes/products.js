import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();

/* 🔐 AUTH MIDDLEWARE */
function checkAuth(req, res, next) {
  const token = req.headers.authorization;

  if (token !== "secure-admin-token") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}

/* 📦 GET all products (PUBLIC) */
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

/* ➕ CREATE product (PROTECTED) */
router.post("/", checkAuth, async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* ❌ DELETE product (PROTECTED) */
router.delete("/:id", checkAuth, async (req, res) => {
  const productId = Number(req.params.id);

  try {
    await prisma.orderItem.deleteMany({
      where: { productId }
    });

    await prisma.product.delete({
      where: { id: productId }
    });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* ✏️ UPDATE product (PROTECTED) */
router.put("/:id", checkAuth, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;