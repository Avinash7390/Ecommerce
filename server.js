import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import customErrorHandler from "./error/errorHandler.js";
//configure env
dotenv.config();

//database config
connectDB();

const app = express();

//middleware...
app.use(express.json());
app.use(morgan("dev"));
//user route...
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "welcome to ecommerce app",
  });
});

app.use(customErrorHandler);

const PORT = process.env.PORT;
//listening the app
app.listen(PORT, () => {
  console.log(
    `server is running on ${process.env.DEV} on port :${PORT}`.bgCyan.white
  );
});
