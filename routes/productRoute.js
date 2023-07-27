import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  getPhotoController,
  deleteProductController,
  updateProductController,
} from "../controllers/productController.js";

import formidable from "express-formidable";

const router = express.Router();

//routes.....

//create Product

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update prodiuct...

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products.....

router.get("/get-product", getProductController);

//single product...

router.get("/get-product/:slug", getSingleProductController);

//get photo...

router.get("/product-photo/:pid", getPhotoController);

//delete Product....

router.delete("/product/:pid", requireSignIn, isAdmin, deleteProductController);

export default router;
