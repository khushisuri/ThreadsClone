"use server";
import mongoose from "mongoose";

export const connectToDb = async () => {
  if (!process.env.MONGO_URL) {
    console.log("MONGO_URL is not defined in environment variables.");
    return;
  }
  let isConnected = false;

  if (isConnected) {
    console.log("Already connected to MongoDB.");
    return;
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URL || "");
    isConnected = true;
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
