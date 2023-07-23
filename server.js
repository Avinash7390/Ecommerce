import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";

//configure env
dotenv.config();

//database config
connectDB();

const app = express();

//middleware...
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send({
    message: "welcome to ecommerce app",
  });
});

const PORT = process.env.PORT;
//listening the app
app.listen(PORT, () => {
  console.log(
    `server is running on ${process.env.DEV} on port :${PORT}`.bgCyan.white
  );
});
