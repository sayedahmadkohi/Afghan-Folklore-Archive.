import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Story from "./models/Story.js";
import User from "./models/User.js";

dotenv.config();

const migrate = async () => {
  try {
    await connectDB();

    const userResult = await User.updateMany(
      { isEmailVerified: { $exists: false } },
      { $set: { isEmailVerified: true } },
    );

    console.log(
      `Auth migration complete: ${userResult.modifiedCount} users marked as email verified`,
    );

    const result = await Story.updateMany(
      {
        $or: [
          { language: { $exists: false } },
          { language: null },
          { language: "" },
        ],
      },
      { $set: { language: "Dari" } },
    );

    console.log(
      `Migration complete: ${result.modifiedCount} stories updated with default language "Dari"`,
    );

    // Verify all stories now have a language field
    const withoutLanguage = await Story.countDocuments({
      language: { $exists: false },
    });
    const withEmptyLanguage = await Story.countDocuments({ language: "" });
    console.log(`Stories without language field: ${withoutLanguage}`);
    console.log(`Stories with empty language: ${withEmptyLanguage}`);

    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrate();
