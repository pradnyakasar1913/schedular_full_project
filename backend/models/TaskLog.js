import mongoose from "mongoose";

const TaskLogSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  executionTime: { type: Date, required: true },
  status: { type: String, enum: ["success", "failed", "retrying"], required: true },
  result: { type: String, required: true },
});

export default mongoose.model("TaskLog", TaskLogSchema);
