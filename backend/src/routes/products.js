import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// CREATE product
router.post("/", async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
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

// UPDATE product
router.put("/:id", async (req, res) => {
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