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
const getProductController = AsynkErrorHandler(async (req, res, next) => {
  const products = await Product.find({})
    .populate("category")
    .select("-photo")
    .limit(12)
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "All pruducts",
    tatalProducts: products.length,
    products,
  });
});

//get single product

const getSingleProductController = AsynkErrorHandler(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug })
    .select("-photo")
    .populate("category");

  res.status(200).json({
    success: true,
    message: "Fetched single Product",
    product,
  });
});

//get photo.....

const getPhotoController = AsynkErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.pid).select("photo");

  if (product.photo.data) {
    res.set("Content-type", product.photo.contentType);

    return res.status(200).send(product.photo.data);
  }
});

//delete product......

const deleteProductController = AsynkErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.pid).select(
    "-photo"
  );

  res.status(200).json({
    success: true,
    message: "Deleted Successfully!",
  });
});

//update product.....

const updateProductController = AsynkErrorHandler(async (req, res, next) => {
  const { name, slug, description, price, category, quantity, shipping } =
    req.fields;

  const { photo } = req.files;
  //validation.......
  //   if (!name) {
  //     return next(new Errorhandler("Name is Required", 400));
  //   }

  //   if (!description) {
  //     return next(new Errorhandler("Description is Required", 400));
  //   }
  //   if (!price) {
  //     return next(new Errorhandler("Price is Required", 400));
  //   }
  //   if (!category) {
  //     return next(new Errorhandler("Category is Required", 400));
  //   }
  //   if (!quantity) {
  //     return next(new Errorhandler("Quantity is Required", 400));
  //   }
  //   if (!photo) {
  //     return next(new Errorhandler("Image is Required is Required", 400));
  //   }

  if (photo && photo.size > 1000000) {
    return next(new Errorhandler("Image size should be less than 1 MB"));
  }

  const products = await Product.findByIdAndUpdate(
    req.params.pid,
    {
      ...req.fields,
      slug: slugify(name),
    },
    { new: true }
  );

  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  await products.save();

  res.status(201).json({
    success: true,
    message: "product Updated Successfully!",
    products,
  });
});

export {
  createProductController,
  getProductController,
  getSingleProductController,
  getPhotoController,
  deleteProductController,
  updateProductController,
};
