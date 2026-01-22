import mongoose from "mongoose";

const clueSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "case",
      required: true,
      index: true,
    },

    clientId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video"],
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    note: {
      text: { type: String, default: null },
      lastEditedAt: { type: Date, default: null },
    },

    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },

    size: {
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },

    meta: {
      source: { type: String, default: null },
      confidence: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

// unique per case
clueSchema.index({ case: 1, clientId: 1 }, { unique: true });

const clueModel = mongoose.model("clue", clueSchema);
export default clueModel;