"server-only";

import mongoose from "mongoose";
import { config } from "@/util/envConfigLoader";

const { MONGODB_URI, MONGODB_DB_NAME } = config;

declare global {
  var mongo: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s of failed connection attempt
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`Connected to MongoDB database: ${MONGODB_DB_NAME}`);
        return mongoose;
      })
      .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        cached.promise = null; // Reset the promise so future calls try to connect again
        throw error; // Re-throw to allow handling by the caller
      });
  }
  try {
    cached.conn = await cached.promise;

    // Setup connection monitoring
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected, attempting to reconnect...");
      cached.conn = null;
      cached.promise = null;
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    return cached.conn;
  } catch (error) {
    // Reset connection promise on error
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
