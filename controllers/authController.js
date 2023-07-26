import { userModel as User } from "../models/userModel.js";

import AsynkErrorHandler from "../error/catchAsyncError.js";
import Errorhandler from "../utils/errorClass.js";
import { comparePassword, hashPassword } from "../utils/authUtils.js";
import jwt from "jsonwebtoken";

const registerController = AsynkErrorHandler(async (req, res, next) => {
  const { name, email, password, phone, address, answer } = req.body;

  if (!name) {
    return next(new Errorhandler("Please Enter your Name", 400));
  }

  if (!email) {
    return next(new Errorhandler("Please Enter Your Email", 400));
  }

  if (!password) {
    return next(new Errorhandler("Please Enter Your Password", 400));
  }
  if (!phone) {
    return next(new Errorhandler("Please Enter Your PhoneNo", 400));
  }
  if (!address) {
    return next(new Errorhandler("Please Enter Your Address", 400));
  }
  if (!answer) {
    return next(new Errorhandler("Please Enter Your Answer", 400));
  }
  //existing user...
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      success: false,
      message: "User already Exist Please login!",
    });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    answer,
  });

  res.status(200).json({
    success: true,
    message: "User Registered Successfully",
    newUser,
  });
});

//login user....
const loginController = AsynkErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Errorhandler("Enter your Email or Password", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Errorhandler("User does not Exist", 404));
  }
  const oldPassword = user.password;

  const isMatchedPassword = await comparePassword(password, oldPassword);
  if (!isMatchedPassword) {
    return next(new Errorhandler("Incorrect Password", 400));
  }
  //token....

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    message: "login successfully",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    },
  });
});

//test route..
const testController = AsynkErrorHandler(async (req, res, next) => {
  res.send({
    message: "protected route",
  });
});

//forgot password....

const forgotPasswordController = AsynkErrorHandler(async (req, res, next) => {
  const { email, answer, newPassword } = req.body;

  if (!email) {
    return next(new Errorhandler("Email is required!", 400));
  }
  if (!answer) {
    return next(new Errorhandler("Answer is required!", 400));
  }
  if (!newPassword) {
    return next(new Errorhandler("Password is required!", 400));
  }

  const user = await User.findOne({ email, answer });

  if (!user) {
    return next(new Errorhandler("Wrong Email or Answer", 404));
  }
  const hashed = await hashPassword(newPassword);
  await User.findByIdAndUpdate(user._id, { password: hashed });

  res.status(201).json({
    success: true,
    message: "Password Reset Successfully!",
  });
});

export {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
};
