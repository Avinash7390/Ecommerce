import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  getPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productPerPageController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
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

router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//filter Product Route...
router.post("/product-filters", productFilterController);

//product count..
router.get("/product-count", productCountController);

//product per page.....

router.get("/product-list/:page", productPerPageController);

//search product....

router.get("/search/:keyword", searchProductController);

//similar product....

router.get("/related-product/:pid/:cid", relatedProductController);

//category wise Product...

router.get("/product-category/:slug", productCategoryController);

//payment route....
//token
router.get("/braintree/token", braintreeTokenController);

//payment...

router.post("/braintree/payment", requireSignIn, braintreePaymentController);
export default router;
