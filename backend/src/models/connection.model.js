import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "case",
      required: true,
      index: true,
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true
    },

    style: {
      color: { type: String, default: "#6ae3ff" },
      width: { type: Number, default: 2 },
    },
  }, { timestamps: true }
);

const connectionModel = mongoose.model("connection", connectionSchema);

export default connectionModel