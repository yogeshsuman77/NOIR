import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  }, { timestamps: true }
);


const caseModel = mongoose.model("case", caseSchema);

export default caseModel