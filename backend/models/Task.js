
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // creator
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // assigned user
    title: { type: String, required: true },
    description: { type: String },
    scheduleAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Running", "Completed", "Failed"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
