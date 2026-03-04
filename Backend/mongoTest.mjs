import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Force IPv4 (fixes many Windows SRV issues)
dns.setDefaultResultOrder("ipv4first");

const uri = process.env.MONGO_URI;

console.log("Mongo URI:", uri);

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });