const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const { protect, requireAuth } = require("../middleware/auth");
const User = require("../models/User");

router.use(protect);

router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json([]);
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  console.log(req.user);
  const user = await User.findById(req.user.id);
  res.json({ username: user.username, message: "لیست تودوها", todos: todos });
});

router.post("/", requireAuth, async (req, res) => {
  const { text } = req.body;
  const todo = await Todo.create({ text, user: req.user.id });
  res.status(201).json(todo);
});

router.put("/:id", requireAuth, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo || todo.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "تودو پیدا نشد" });
  }
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});
router.patch("/:id", requireAuth, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo || todo.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "تودو پیدا نشد" });
  }

  todo.text = req.body.text;
  await todo.save();
  res.json(todo);
});
router.delete("/:id", requireAuth, async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  res.json({ message: "حذف شد" });
});

module.exports = router;
