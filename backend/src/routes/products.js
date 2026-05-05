import express from "express";
import pkg from "@prisma/client";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

function checkAuth(req, res, next) {
  const token = req.headers.authorization;

  if (token !== "secure-admin-token") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}

/* GET PRODUCTS */
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

/* CREATE PRODUCT */
router.post("/", checkAuth, upload.array("images", 5), async (req, res) => {
  try {
    const body = req.body || {};
    const { name, price, category, stock, description } = body;

    if (!name || !price || !stock) {
      return res.status(400).json({
        error: "Name, price, and stock are required",
      });
    }

    const imageUrls = [];

    for (const file of req.files || []) {
      const url = await uploadToCloudinary(file.buffer);
      imageUrls.push(url);
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category: category || "General",
        stock: Number(stock),
        description: description || "",
        image: imageUrls[0] || "",
        images: imageUrls,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload product" });
  }
});

/* DELETE PRODUCT */
router.delete("/:id", checkAuth, async (req, res) => {
  const productId = Number(req.params.id);

  try {
    await prisma.orderItem.deleteMany({
      where: { productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* UPDATE PRODUCT */
router.put("/:id", checkAuth, upload.array("images", 5), async (req, res) => {
  try {
    const body = req.body || {};
    const { name, price, category, stock, description } = body;

    const productId = Number(req.params.id);

    if (!name || !price || !stock) {
      return res.status(400).json({
        error: "Name, price, and stock are required",
      });
    }

    const imageUrls = [];

    for (const file of req.files || []) {
      const url = await uploadToCloudinary(file.buffer);
      imageUrls.push(url);
    }

    const updateData = {
      name,
      price: Number(price),
      category: category || "General",
      stock: Number(stock),
      description: description || "",
    };

    if (imageUrls.length > 0) {
      updateData.image = imageUrls[0];
      updateData.images = imageUrls;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export default router;