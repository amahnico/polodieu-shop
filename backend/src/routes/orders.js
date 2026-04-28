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

/* 📦 GET all orders (PROTECTED - admin only) */
router.get("/", checkAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to load orders" });
  }
});

/* ✏️ UPDATE order status (PROTECTED) */
router.put("/:id", checkAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* 🛒 CREATE order (PUBLIC) */
router.post("/", async (req, res) => {
  try {
    const { phone, address, items } = req.body;

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        phone,
        address,
        total,
        status: "PENDING",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

export default router;