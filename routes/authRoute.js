import express from "express";

import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

//router object..

const router = express.Router();

//routing...
//REGISTER||METHOD POST..
router.post("/register", registerController);

//LOGIN || POST..
router.post("/login", loginController);

//TEST ROUTE..
router.get("/test", requireSignIn, isAdmin, testController);

//FORGOT PASSWORD || POST METHOD....

router.post("/reset-password", forgotPasswordController);

//protected route....
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
