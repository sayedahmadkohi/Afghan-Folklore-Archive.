import mongoose from "mongoose";
import User from "./models/User.js";

const promoteAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/afghan-folklore-archive");
    console.log("MongoDB Connected");

    const email = "1034vega@gmail.com";
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      console.log("Creating admin account...");
      
      const newUser = await User.create({
        fullName: "Admin User",
        email: email,
        password: "Admin123!",
        isEmailVerified: true,
        role: "admin",
      });
      
      console.log(`Admin account created: ${newUser.fullName} (${newUser.email})`);
      console.log(`Role: ${newUser.role}`);
      console.log("Password: Admin123!");
      console.log("Please change this password after first login.");
    } else {
      console.log(`Found user: ${user.fullName} (${user.email})`);
      console.log(`Current role: ${user.role || "undefined"}`);

      user.role = "admin";
      await user.save();

      console.log(`Successfully promoted ${email} to admin role`);
      console.log(`New role: ${user.role}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error promoting admin:", error);
    process.exit(1);
  }
};

promoteAdmin();
