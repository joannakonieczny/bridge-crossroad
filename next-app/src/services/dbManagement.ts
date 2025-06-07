"use server";

import mongoose from "mongoose";
import { config } from "@/util/envConfigLoader";

const uri = config.MONGO_URI;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(uri, {});
}