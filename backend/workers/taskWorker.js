import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import TaskLog from '../models/TaskLog.js';

const connection = new IORedis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });

export const startTaskWorker = () => {
  const worker = new Worker('task-queue', async job => {
    console.log(`Executing task ${job.id}`);
    // Here you can implement actual task execution
    await TaskLog.create({ taskId: job.data.taskId, status: 'success', result: 'Task executed' });
  }, { connection });

  worker.on('completed', job => console.log(`Task ${job.id} completed`));
  worker.on('failed', (job, err) => console.log(`Task ${job.id} failed`, err));
};
