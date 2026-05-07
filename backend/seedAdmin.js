const bcrypt = require("bcryptjs");
const db = require("./db");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function seed() {
  try {
    const adminExists = db.findUser(u => u.username === "admin");
    if (adminExists) {
      console.log("Admin user already exists.");
    } else {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      db.addUser({
        username: "admin",
        email: "admin@stegoshield.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("Admin user created successfully in database.json!");
      console.log("Username: admin");
      console.log("Password: Admin@123");
    }
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  }
}

seed();
