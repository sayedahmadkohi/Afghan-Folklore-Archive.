import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Story title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Legends",
        "Poetry",
        "Historical Tales",
        "Romantic Stories",
        "Epic Stories",
        "Mythology",
      ],
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      enum: [
        "Badakhshan",
        "Badghis",
        "Baghlan",
        "Balkh",
        "Bamyan",
        "Daykundi",
        "Farah",
        "Faryab",
        "Ghazni",
        "Ghor",
        "Helmand",
        "Herat",
        "Jawzjan",
        "Kabul",
        "Kandahar",
        "Kapisa",
        "Khost",
        "Kunar",
        "Kunduz",
        "Laghman",
        "Logar",
        "Nangarhar",
        "Nimruz",
        "Nuristan",
        "Paktia",
        "Paktika",
        "Panjshir",
        "Parwan",
        "Samangan",
        "Sar-e Pol",
        "Takhar",
        "Urozgan",
        "Wardak",
        "Zabul",
      ],
    },
    tags: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Story content is required"],
      minlength: [50, "Story content must be at least 50 characters"],
    },
    description: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      enum: ["Dari", "Pashto", "Uzbek", "Arabic", "English"],
      default: "Dari",
    },
    readingTime: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Story = mongoose.model("Story", storySchema);
export default Story;
