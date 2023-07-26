import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { createProductController } from "../controllers/productController.js";

import formidable from "express-formidable";

const router = express.Router();

//routes.....

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//get products.....

export default router;
