const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stegoshield";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
      console.log("Admin user already exists in MongoDB.");
    } else {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      const admin = new User({
        username: "admin",
        email: "admin@stegoshield.com",
        password: hashedPassword,
        role: "admin"
      });
      await admin.save();
      console.log("✅ Admin user created successfully in MongoDB!");
      console.log("Username: admin");
      console.log("Password: Admin@123");
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  }
}

seed();
