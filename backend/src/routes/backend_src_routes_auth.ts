import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res.status(201).json({ id: user.id, username: user.username, email: user.email });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  res.json({ token });
});

export default router;