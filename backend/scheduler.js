
// // import { Queue, Worker } from "bullmq";
// // import IORedis from "ioredis";
// // import Task from "./models/Task.js";
// // import TaskLog from "./models/TaskLog.js";

// // // Redis connection
// // const connection = new IORedis({
// //   host: "127.0.0.1",
// //   port: 6379,
// // });

// // // Queue
// // export const taskQueue = new Queue("task-queue", { connection });

// // // Worker
// // const worker = new Worker(
// //   "task-queue",
// //   async (job) => {
// //     console.log(`Processing job: ${job.data.title} (taskId: ${job.data.taskId})`);

// //     // Fetch task from MongoDB
// //     const task = await Task.findById(job.data.taskId);
// //     if (!task) return;

// //     try {
// //       // Simulate execution (replace with real logic)
// //       await new Promise((resolve) => setTimeout(resolve, 1000));

// //       // Update task
// //       task.status = "Completed";
// //       await task.save();

// //       // Log execution
// //       await TaskLog.create({
// //         taskId: task._id,
// //         executionTime: new Date(),
// //         status: "success",
// //         result: "Task executed successfully",
// //       });

// //       console.log(`Completed job: ${job.data.title}`);
// //     } catch (err) {
// //       task.status = "Failed";
// //       await task.save();
// //       await TaskLog.create({
// //         taskId: task._id,
// //         executionTime: new Date(),
// //         status: "failed",
// //         result: err.message,
// //       });
// //       console.error(`Failed job: ${job.data.title}`, err);
// //     }
// //   },
// //   { connection }
// // );

// // // Event listeners
// // worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
// // worker.on("failed", (job, err) => console.error(`Job ${job.id} failed: ${err.message}`));
// import { Queue, Worker } from "bullmq";
// import IORedis from "ioredis";
// import Task from "./models/Task.js";
// import TaskLog from "./models/TaskLog.js";
// import { ObjectId } from "mongodb";

// // Redis connection
// const connection = new IORedis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null, // avoid deprecation warning
// });

// // Queue
// export const taskQueue = new Queue("task-queue", { connection });

// // Worker
// const worker = new Worker(
//   "task-queue",
//   async (job) => {
//     console.log(`Processing job: ${job.data.title} (taskId: ${job.data.taskId})`);

//     try {
//       // Convert taskId to ObjectId
//       const task = await Task.findById(new ObjectId(job.data.taskId));
//       if (!task) {
//         console.error(`Task not found for job: ${job.id}`);
//         return;
//       }

//       // Simulate task execution
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update task status
//       task.status = "Completed";
//       await task.save();

//       // Log execution
//       await TaskLog.create({
//         taskId: task._id,
//         executionTime: new Date(),
//         status: "success",
//         result: "Task executed successfully",
//       });

//       console.log(`Completed job: ${job.data.title}`);
//     } catch (err) {
//       console.error(`Failed job: ${job.data.title}`, err);

//       try {
//         const task = await Task.findById(new ObjectId(job.data.taskId));
//         if (task) {
//           task.status = "Failed";
//           await task.save();

//           await TaskLog.create({
//             taskId: task._id,
//             executionTime: new Date(),
//             status: "failed",
//             result: err.message,
//           });
//         }
//       } catch (innerErr) {
//         console.error("Error updating failed task:", innerErr);
//       }
//     }
//   },
//   { connection }
// );

// // Event listeners
// worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
// worker.on("failed", (job, err) => console.error(`Job ${job.id} failed: ${err.message}`));

// // Function to add job with delay
// export const scheduleTask = async (task) => {
//   const delay = new Date(task.scheduleAt) - Date.now();
//   await taskQueue.add(
//     "task-job",
//     { taskId: task._id.toString(), title: task.title },
//     { delay: delay > 0 ? delay : 0 }
//   );
//   console.log(`Scheduled task: ${task.title} with delay ${delay}ms`);
// };

// console.log("Scheduler initialized and worker running...");
// import { Queue, Worker } from "bullmq";
// import IORedis from "ioredis";
// import Task from "./models/Task.js";
// import TaskLog from "./models/TaskLog.js";

// // Redis connection
// const connection = new IORedis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null, // fix BullMQ deprecation warning
// });

// // Queue
// export const taskQueue = new Queue("task-queue", { connection });

// // Worker
// const worker = new Worker(
//   "task-queue",
//   async (job) => {
//     console.log(`Processing job: ${job.data.title} (taskId: ${job.data.taskId})`);

//     const task = await Task.findById(job.data.taskId);
//     if (!task) return;

//     try {
//       // Simulate execution (replace with real logic if needed)
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update status
//       task.status = "Completed";
//       await task.save();

//       // Log
//       await TaskLog.create({
//         taskId: task._id,
//         executionTime: new Date(),
//         status: "success",
//         result: "Task executed successfully",
//       });

//       console.log(`Completed job: ${job.data.title}`);
//     } catch (err) {
//       task.status = "Failed";
//       await task.save();
//       await TaskLog.create({
//         taskId: task._id,
//         executionTime: new Date(),
//         status: "failed",
//         result: err.message,
//       });
//       console.error(`Failed job: ${job.data.title}`, err);
//     }
//   },
//   { connection }
// );

// // Optional: log events
// worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
// worker.on("failed", (job, err) => console.error(`Job ${job.id} failed: ${err.message}`));
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import Task from "./models/Task.js";
import TaskLog from "./models/TaskLog.js";
import { taskSuccessCounter, taskFailureCounter } from "./server.js"; // Prometheus counters

const connection = new IORedis({ host: "127.0.0.1", port: 6379, maxRetriesPerRequest: null });

// Queue
export const taskQueue = new Queue("task-queue", { connection });

// Worker
const worker = new Worker(
  "task-queue",
  async (job) => {
    console.log(`Processing job: ${job.data.title} (taskId: ${job.data.taskId})`);

    const task = await Task.findById(job.data.taskId);
    if (!task) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate task

      task.status = "Completed";
      await task.save();

      await TaskLog.create({
        taskId: task._id,
        executionTime: new Date(),
        status: "success",
        result: "Task executed successfully",
      });

      taskSuccessCounter.inc(); // Increment success metric
      console.log(`Completed job: ${job.data.title}`);
    } catch (err) {
      task.status = "Failed";
      await task.save();

      await TaskLog.create({
        taskId: task._id,
        executionTime: new Date(),
        status: "failed",
        result: err.message,
      });

      taskFailureCounter.inc(); // Increment failure metric
      console.error(`Failed job: ${job.data.title}`, err);
    }
  },
  { connection }
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed: ${err.message}`));
worker.on("error", (err) => console.error("Worker error:", err));

console.log("Scheduler initialized and worker is listening for tasks...");
