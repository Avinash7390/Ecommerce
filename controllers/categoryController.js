import AsynkErrorHandler from "../error/catchAsyncError.js";
import { categoryModel as Category } from "../models/categoryModel.js";
import Errorhandler from "../utils/errorClass.js";
import slugify from "slugify";

//create category...
const createCategoryController = AsynkErrorHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new Errorhandler("Name is Required", 401));
  }

  const existCat = await Category.findOne({ name });

  if (existCat) {
    return next(new Errorhandler("Category already exist", 400));
  }

  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({
    success: true,
    message: "Added successfully!",
    category,
  });
});

//update category...
const updateCategoryController = AsynkErrorHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Updated Successfully!",
    category,
  });
});

//get all categories...

const getAllCategoryCotroller = AsynkErrorHandler(async (req, res, next) => {
  const category = await Category.find({});

  res.status(200).json({
    success: true,
    message: "All Categories List",
    category,
  });
});

//single category....

const singlecategoryController = AsynkErrorHandler(async (req, res, next) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  res.status(200).json({
    success: true,
    message: "single category find successfully!",
    category,
  });
});

//delete category.....

const deleteCategoryController = AsynkErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "deleted successfully!",
  });
});

export {
  createCategoryController,
  updateCategoryController,
  getAllCategoryCotroller,
  singlecategoryController,
  deleteCategoryController,
};
