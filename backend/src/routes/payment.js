import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();

router.post("/pay", async (req, res) => {
  const { amount, phone, orderId } = req.body;

  try {
    // simulate payment success (sandbox)
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: "PAID" }
    });

    res.json({
      message: "Payment successful",
      orderId
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;