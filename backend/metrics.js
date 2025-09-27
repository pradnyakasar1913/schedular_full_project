// metrics.js
import client from "prom-client";

// Create a registry
export const metricsRegister = new client.Registry();
client.collectDefaultMetrics({ register: metricsRegister }); // Node.js default metrics

// Counters
export const taskSuccessCounter = new client.Counter({
  name: "task_success_total",
  help: "Total number of successful tasks",
  labelNames: ["user"], // track per-user
});

export const taskFailureCounter = new client.Counter({
  name: "task_failure_total",
  help: "Total number of failed tasks",
  labelNames: ["user"], // track per-user
});

// Gauge for pending tasks
export const taskPendingGauge = new client.Gauge({
  name: "task_pending_total",
  help: "Current number of pending tasks",
  labelNames: ["user"],
});

// Register all metrics
metricsRegister.registerMetric(taskSuccessCounter);
metricsRegister.registerMetric(taskFailureCounter);
metricsRegister.registerMetric(taskPendingGauge);
