// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";

// // Import routes
// import authRoutes from "./routes/auth.js";
// import taskRoutes from "./routes/tasks.js";
// import userRoutes from "./routes/users.js";  // <-- import user routes
// import "./scheduler.js";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/users", userRoutes);       // <-- add this

// const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error(err));

// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// // Import routes
// import authRoutes from "./routes/auth.js";
// import taskRoutes from "./routes/tasks.js";
// import userRoutes from "./routes/users.js";
// import "./scheduler.js";  // your scheduler file

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/users", userRoutes);

// // Create HTTP server and attach Socket.IO
// const server = http.createServer(app);
// export const io = new Server(server, {
//   cors: { origin: "*" }  // or put your frontend URL instead of "*"
// });

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("MongoDB connected");
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
// .catch((err) => console.error(err));

  
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import taskRoutes from "./routes/tasks.js";

// const app = express();
// app.use(express.json());

// // Routes
// app.use("/api/tasks", taskRoutes);

// // Create HTTP server and attach Socket.IO
// const server = http.createServer(app);
// export const io = new Server(server, {
//   cors: { origin: "*" } // Allow your frontend URL
// });

// // MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/scheduler", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.error(err));

// const PORT = 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import client from "prom-client"; // Prometheus client
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";
import "./scheduler.js";  // Scheduler handles BullMQ tasks

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ===== Prometheus Metrics =====
const metricsRegister = new client.Registry();
client.collectDefaultMetrics({ register: metricsRegister });

// Custom metrics counters
export const taskSuccessCounter = new client.Counter({
  name: "task_success_total",
  help: "Total number of successful tasks",
});
export const taskFailureCounter = new client.Counter({
  name: "task_failure_total",
  help: "Total number of failed tasks",
});

metricsRegister.registerMetric(taskSuccessCounter);
metricsRegister.registerMetric(taskFailureCounter);

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// ===== Prometheus endpoint =====
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", metricsRegister.contentType);
    res.end(await metricsRegister.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// ===== HTTP Server + Socket.IO =====
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error(err));
