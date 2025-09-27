
// import Task from "../models/Task.js";

// // Create task
// export const createTask = async (req, res) => {
//   try {
//     const { title, description, scheduleTime, recurrence, assignedTo } = req.body;

//     const userId = req.user._id; // logged-in user

//     const task = new Task({
//       title,
//       description,
//       scheduleAt: scheduleTime,
//       recurrence: recurrence || "once",
//       user: userId,
//       assignedTo: assignedTo || userId, // assign to self if not specified
//     });

//     await task.save();
//     res.status(201).json({ message: "Task created", task });
//   } catch (err) {
//     console.error("Create task error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all tasks
// // export const getTasks = async (req, res) => {
// //   try {
// //     const tasks = await Task.find()
// //       .populate("assignedTo", "username")
// //       .populate("user", "username")
// //       .sort({ scheduleAt: -1 });

// //     res.json(tasks);
// //   } catch (err) {
// //     console.error("Get tasks error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// export const getTasks = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const role = req.user.role;

//     // Admin sees all tasks, client sees only assigned tasks
//     const filter = role === "admin" ? {} : { assignedTo: userId };

//     const tasks = await Task.find(filter)
//       .populate("assignedTo", "username")
//       .populate("user", "username")
//       .sort({ scheduleAt: -1 });

//     res.json(tasks);
//   } catch (err) {
//     console.error("Get tasks error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const editTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, scheduleAt, recurrence, assignedTo } = req.body;

//     const task = await Task.findById(id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Check permission: admin can edit any, client only own
//     if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized to edit this task" });
//     }

//     task.title = title || task.title;
//     task.description = description || task.description;
//     task.scheduleAt = scheduleAt || task.scheduleAt;
//     task.recurrence = recurrence || task.recurrence;
//     task.assignedTo = assignedTo || task.assignedTo;

//     await task.save();
//     res.json({ message: "Task updated", task });
//   } catch (err) {
//     console.error("Edit task error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete task
// export const deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findById(id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Check permission
//     if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized to delete this task" });
//     }

//     await task.deleteOne();
//     res.json({ message: "Task deleted" });
//   } catch (err) {
//     console.error("Delete task error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


import Task from "../models/Task.js";
import { taskQueue } from "../scheduler.js"; // IMPORTANT: import taskQueue

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, scheduleTime, recurrence, assignedTo } = req.body;
    const userId = req.user._id;

    const task = new Task({
      title,
      description,
      scheduleAt: scheduleTime,
      recurrence: recurrence || "once",
      user: userId,
      assignedTo: assignedTo || userId,
      status: "Scheduled",
    });

    await task.save();

    // Calculate delay for BullMQ
    const delay = new Date(scheduleTime).getTime() - Date.now();
    const jobOptions = delay > 0 ? { delay } : {}; // run immediately if time in past

    await taskQueue.add(
      "execute-task",
      { taskId: task._id, title: task.title },
      jobOptions
    );

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tasks
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    const filter = role === "admin" ? {} : { assignedTo: userId };
    const tasks = await Task.find(filter)
      .populate("assignedTo", "username")
      .populate("user", "username")
      .sort({ scheduleAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit task
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, scheduleAt, recurrence, assignedTo } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.scheduleAt = scheduleAt || task.scheduleAt;
    task.recurrence = recurrence || task.recurrence;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();

    // Re-add job to queue if scheduleAt changed
    if (scheduleAt) {
      const delay = new Date(scheduleAt).getTime() - Date.now();
      await taskQueue.add(
        "execute-task",
        { taskId: task._id, title: task.title },
        delay > 0 ? { delay } : {}
      );
    }

    res.json({ message: "Task updated", task });
  } catch (err) {
    console.error("Edit task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
