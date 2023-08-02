import { productModel as Product } from "../models/productModel.js";
import { categoryModel as Category } from "../models/categoryModel.js";
import { orderModel as Order } from "../models/orderModel.js";
import AsynkErrorHandler from "../error/catchAsyncError.js";
import slugify from "slugify";

import fs from "fs";
import Errorhandler from "../utils/errorClass.js";
import braintree from "braintree";

//payment gateway...

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "c8yscxp9wpz8y96r",
  publicKey: "2h72z7xkqh4kj5zs",
  privateKey: "1459aeb19032525550f565819a99a769",
  // environment: braintree.Environment.Sandbox,
  // merchantId: process.env.BRAINTREE_MERCHAINT_ID,
  // publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  // privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

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

//filter product........

const productFilterController = AsynkErrorHandler(async (req, res, next) => {
  const { checked, radio } = req.body;
  let args = {};
  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(args);

  res.status(200).json({
    success: true,
    products,
  });
});

//product count......

const productCountController = AsynkErrorHandler(async (req, res, next) => {
  const total = await Product.find({}).estimatedDocumentCount();

  res.status(200).json({
    success: true,
    total,
  });
});

//product per page.....

const productPerPageController = AsynkErrorHandler(async (req, res, next) => {
  const perPage = 6;
  const page = req.params.page ? req.params.page : 1;

  const products = await Product.find({})
    .select("-photo")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    products,
  });
});

//serach product

const searchProductController = AsynkErrorHandler(async (req, res, next) => {
  const { keyword } = req.params;
  const result = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  }).select("-photo");
  res.send(result);
});

//related product.....
const relatedProductController = AsynkErrorHandler(async (req, res, next) => {
  const { pid, cid } = req.params;
  const products = await Product.find({
    category: cid,
    _id: { $ne: pid },
  })
    .select("-photo")
    .limit(3)
    .populate("category");
  res.status(200).json({
    success: true,
    products,
  });
});

//category wise product......
const productCategoryController = AsynkErrorHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  const products = await Product.find({ category }).populate("category");
  res.status(200).json({
    success: true,
    category,
    products,
  });
});

//payment gateway api.....

const braintreeTokenController = AsynkErrorHandler(async (req, res, next) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
});

//payment...

const braintreePaymentController = AsynkErrorHandler(async (req, res, next) => {
  const { cart, nonce } = req.body;
  let total = 0;
  cart.map((i) => {
    total += i.price;
  });

  let newTransaction = gateway.transaction.sale(
    {
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: nonce,
      },
    },
    function (error, result) {
      if (result) {
        const order = new Order({
          products: cart,
          payment: result,
          buyers: req.user._id,
        }).save();

        res.json({ ok: true });
      } else {
        res.status(500).send(error);
      }
    }
  );
});

export {
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
};
