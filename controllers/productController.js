import { productModel as Product } from "../models/productModel.js";
import { categoryModel as Category } from "../models/categoryModel.js";
import AsynkErrorHandler from "../error/catchAsyncError.js";
import slugify from "slugify";

import fs from "fs";
import Errorhandler from "../utils/errorClass.js";

//create product.....

const createProductController = AsynkErrorHandler(async (req, res, next) => {
  const { name, slug, description, price, category, quantity, shipping } =
    req.fields;

  const { photo } = req.files;
  //validation.......
  if (!name) {
    return next(new Errorhandler("Name is Required", 400));
  }

  if (!description) {
    return next(new Errorhandler("Description is Required", 400));
  }
  if (!price) {
    return next(new Errorhandler("Price is Required", 400));
  }
  if (!category) {
    return next(new Errorhandler("Category is Required", 400));
  }
  if (!quantity) {
    return next(new Errorhandler("Quantity is Required", 400));
  }
  if (!photo) {
    return next(new Errorhandler("Image is Required is Required", 400));
  }

  if (photo && photo.size > 1000000) {
    return next(new Errorhandler("Image size should be less than 1 MB"));
  }

  const products = new Product({ ...req.fields, slug: slugify(name) });

  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  await products.save();

  res.status(201).json({
    success: true,
    message: "product Created Successfully!",
    products,
  });
});

//get products....

export { createProductController };
