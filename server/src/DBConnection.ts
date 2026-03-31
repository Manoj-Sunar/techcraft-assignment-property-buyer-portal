// src/DBConnection.ts
import { MongoClient } from "mongodb";
import mongoose from "mongoose";






export const ConnectDB = async (): Promise<void> => {
  const mongoUri = process.env.DB_CONNECTION_STRING;
  if (!mongoUri) throw new Error("DB_CONNECTION_STRING is not defined");

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");

    // Auto-reconnect if disconnected
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected! Reconnecting...");
      setTimeout(() => ConnectDB(), 5000);
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};