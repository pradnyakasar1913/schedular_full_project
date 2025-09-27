import Queue from "bullmq";
import Redis from "ioredis";
import Task from "../models/Task.js";
import TaskLog from "../models/TaskLog.js";

const connection = new Redis(process.env.REDIS_URL);

export const taskQueue = new Queue("tasks", { connection });

export const addTaskToQueue = async (task) => {
  await taskQueue.add("run-task", { taskId: task._id }, { delay: new Date(task.scheduleTime) - Date.now() });
};

// Process queue
taskQueue.process(async (job) => {
  const task = await Task.findById(job.data.taskId);
  if (!task) return;

  try {
    // TODO: Add your actual task execution logic
    task.status = "completed";
    await task.save();

    await TaskLog.create({
      taskId: task._id,
      executionTime: new Date(),
      status: "success",
      result: "Task executed successfully"
    });

  } catch (err) {
    task.status = "failed";
    await task.save();
    await TaskLog.create({
      taskId: task._id,
      executionTime: new Date(),
      status: "failed",
      result: err.message
    });
  }
});
