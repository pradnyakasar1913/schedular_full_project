import User from "../models/User.js";
// ✅ Get list of clients
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "client" }).select("_id username role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Already existing example
export const removeUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove user" });
  }
};


