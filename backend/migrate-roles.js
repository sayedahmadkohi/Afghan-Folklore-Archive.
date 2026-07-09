import mongoose from "mongoose";
import User from "./models/User.js";

const migrateRoles = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/afghan-folklore-archive");
    console.log("MongoDB Connected");

    // Find all users without a role field
    const usersWithoutRole = await User.find({ role: { $exists: false } });
    console.log(`Found ${usersWithoutRole.length} users without role field`);

    let adminCount = 0;
    let userCount = 0;

    for (const user of usersWithoutRole) {
      if (user.email === "123ahd@gmail.com") {
        user.role = "admin";
        await user.save();
        adminCount++;
        console.log(`✓ Updated ${user.email} to role: admin`);
      } else {
        user.role = "user";
        await user.save();
        userCount++;
        console.log(`✓ Updated ${user.email} to role: user`);
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Total users updated: ${usersWithoutRole.length}`);
    console.log(`Admin users: ${adminCount}`);
    console.log(`Regular users: ${userCount}`);

    // Verify the migration
    const adminUsers = await User.find({ role: "admin" });
    const regularUsers = await User.find({ role: "user" });
    const usersWithoutRoleAfter = await User.find({ role: { $exists: false } });

    console.log("\n=== Verification ===");
    console.log(`Admin users in database: ${adminUsers.length}`);
    console.log(`Regular users in database: ${regularUsers.length}`);
    console.log(`Users still without role: ${usersWithoutRoleAfter.length}`);

    if (usersWithoutRoleAfter.length === 0) {
      console.log("\n✓ Migration completed successfully!");
    } else {
      console.log("\n✗ Some users still missing role field");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

migrateRoles();
