const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "ثبت‌نام موفق" });
  } catch (err) {
    res.status(400).json({ message: "نام کاربری تکراری است" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "نام کاربری یا رمز اشتباه است" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "ورود موفق" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "خروج موفق" });
});

module.exports = router;
