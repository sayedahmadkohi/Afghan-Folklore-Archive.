import dotenv from "dotenv";
import mongoose from "mongoose";
import Story from "./models/Story.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Story.deleteMany({});
    console.log("Cleared existing stories");

    // Read stories from frontend data
    const storiesPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "stories.json",
    );
    let storiesData = [];

    if (fs.existsSync(storiesPath)) {
      const raw = fs.readFileSync(storiesPath, "utf-8");
      storiesData = JSON.parse(raw);
    } else {
      console.log("stories.json not found, creating minimal seed data");
      storiesData = [];
    }

    // Create a seed author user if none exists
    let seedAuthor = await User.findOne({ email: "seed@afghanfolklore.com" });
    if (!seedAuthor) {
      seedAuthor = await User.create({
        fullName: "Afghan Folklore Archive",
        email: "seed@afghanfolklore.com",
        password: "password123",
        acceptedRules: true,
        isEmailVerified: true,
      });
      console.log("Created seed author user");
    }

    // Transform and insert stories
    const stories = storiesData.map((s) => ({
      title: s.title,
      category: s.category,
      region: s.region,
      tags: "",
      image: s.image || "",
      content: s.content,
      description: s.description || "",
      language: s.language || "Dari",
      readingTime: s.readingTime || "",
      author: seedAuthor._id,
    }));

    const created = await Story.insertMany(stories);
    console.log(`Seeded ${created.length} stories`);

    console.log("\nSeed complete!");
    console.log("You can login with: seed@afghanfolklore.com / password123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
