export async function closeMongodbConnection() {
  const mongooseModule = await import("mongoose");
  const mongoose = mongooseModule.default ?? mongooseModule;
  if (mongoose && typeof mongoose.disconnect === "function") {
    await mongoose.disconnect();
    console.info("Mongoose disconnected");
  }
}
