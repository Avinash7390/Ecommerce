import Errorhandler from "../utils/errorClass.js";

const customErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong mongoDB ID error...
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }

  //mongoose duplicate key error...
  if (err.code === 11000) {
    const message = `User already exist`;
    err = new Errorhandler(message, 404);
  }

  //wrong JWT token...
  if (err.name === "jsonWebTokenError") {
    const message = `Wrong JWT try again!`;
    err = new Errorhandler(message, 500);
  }

  //jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `JWT has been expired!`;
    err = new Errorhandler(message, 500);
  }

  res.status(err.statusCode).json({
    success: false,
    errorMessage: err.message,
  });
};

export default customErrorHandler;
