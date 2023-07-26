import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  getAllCategoryCotroller,
  singlecategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//routes...
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category....

router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get all category....

router.get("/get-category", getAllCategoryCotroller);

//single category....

router.get("/single-category/:slug", singlecategoryController);

//delete category...

router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
