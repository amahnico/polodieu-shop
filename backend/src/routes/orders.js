import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
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
});

// UPDATE order status
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: { status }
  });

  res.json(order);
});

// CREATE order
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