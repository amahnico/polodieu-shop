import express from "express";
import pkg from "@prisma/client";
import crypto from "crypto";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();

const BASE_URL = process.env.MTN_BASE_URL;
const PRIMARY_KEY = process.env.MTN_COLLECTION_PRIMARY_KEY;
const API_USER = process.env.MTN_API_USER;
const API_KEY = process.env.MTN_API_KEY;
const TARGET_ENV = process.env.MTN_TARGET_ENVIRONMENT || "sandbox";

async function getMtnToken() {
  const auth = Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");

  const res = await fetch(`${BASE_URL}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Ocp-Apim-Subscription-Key": PRIMARY_KEY
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  const data = await res.json();
  return data.access_token;
}

/* START MTN PAYMENT */
router.post("/mtn", async (req, res) => {
  try {
    const { amount, phone, orderId } = req.body;

    if (!amount || !phone || !orderId) {
      return res.status(400).json({
        error: "amount, phone, and orderId are required"
      });
    }

    const token = await getMtnToken();
    const referenceId = crypto.randomUUID();

    const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Reference-Id": referenceId,
        "X-Target-Environment": TARGET_ENV,
        "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: String(amount),
        currency: "XAF",
        externalId: String(orderId),
        payer: {
          partyIdType: "MSISDN",
          partyId: phone
        },
        payerMessage: "Polodieu Shop Payment",
        payeeNote: `Order #${orderId}`
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    res.json({
      message: "MTN payment request sent",
      referenceId,
      orderId
    });
  } catch (error) {
    console.log("MTN PAYMENT ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* CHECK MTN PAYMENT STATUS */
router.get("/mtn/:referenceId/status", async (req, res) => {
  try {
    const { referenceId } = req.params;
    const { orderId } = req.query;

    const token = await getMtnToken();

    const response = await fetch(
      `${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": TARGET_ENV,
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();

    if (data.status === "SUCCESSFUL" && orderId) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: "PAID" }
      });
    }

    res.json(data);
  } catch (error) {
    console.log("MTN STATUS ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;