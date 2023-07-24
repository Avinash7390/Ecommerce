import mongoose, { mongo } from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "NewEcommerce",
    });
    console.log(
      `Connected to Mongodb database : ${connect.connection.host}`.bgMagenta
        .white
    );
  } catch (error) {
    console.log(`Error in mongoDB ${error}`.bgRed.white);
  }
};

export default connectDB;
