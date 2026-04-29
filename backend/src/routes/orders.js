import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();

function checkAuth(req, res, next) {
  const token = req.headers.authorization;

  if (token !== "secure-admin-token") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}

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

router.post("/", async (req, res) => {
  try {
    const { phone, address, items } = req.body;

    if (!phone || !address || !items || items.length === 0) {
      return res.status(400).json({ error: "Phone, address, and items are required" });
    }

    const order = await prisma.$transaction(async (tx) => {
      let total = 0;

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: Number(item.productId) }
        });

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < item.quantity) {
          throw new Error(`${product.name} only has ${product.stock} left`);
        }

        total += Number(product.price) * Number(item.quantity);
      }

      const createdOrder = await tx.order.create({
        data: {
          phone,
          address,
          total,
          status: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
              price: Number(item.price)
            }))
          }
        },
        include: {
          items: true
        }
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: Number(item.productId) },
          data: {
            stock: {
              decrement: Number(item.quantity)
            }
          }
        });
      }

      return createdOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;