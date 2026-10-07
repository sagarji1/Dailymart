const crypto = require("crypto");
const express = require("express");
const User = require("../model/User");
const { signToken } = require("../middleware/auth");

const router = express.Router();
const hashPassword = (password, salt) => crypto.scryptSync(password, salt, 64).toString("hex");
const userResponse = (user) => ({ token: signToken(user._id.toString()), user: { id: user._id.toString(), email: user.email } });

router.post("/register", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Provide a valid email and a password of at least 8 characters" });
  }
  try {
    const passwordSalt = crypto.randomBytes(16).toString("hex");
    const user = await User.create({ email, passwordSalt, passwordHash: hashPassword(password, passwordSalt) });
    return res.status(201).json(userResponse(user));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "An account with this email already exists" });
    return res.status(500).json({ error: "Unable to create account" });
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const user = await User.findOne({ email });
  if (!user || typeof password !== "string" || !crypto.timingSafeEqual(Buffer.from(hashPassword(password, user.passwordSalt), "hex"), Buffer.from(user.passwordHash, "hex"))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  return res.json(userResponse(user));
});

module.exports = router;
