import mongoose from "mongoose";
import { DB_NAME } from "../utils/contant.js";

const dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URL + "/" + DB_NAME
    );
    console.log(
      "Database connected successfully",
      connectionInstance.connection.host
    );
    return true;
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit(1);
  }
};

export default dbConnection;
