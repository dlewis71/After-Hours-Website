import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js"; // Adjust the path if your model is elsewhere

dotenv.config();

const deleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for deletion...");

    await User.deleteMany({}); // An empty object {} means delete everything

    console.log("All users have been successfully deleted.");
    process.exit();
  } catch (error) {
    console.error(`Error deleting data: ${error}`);
    process.exit(1);
  }
};

deleteData();