const express = require("express");
const router = express.Router();
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey"; // Keep safe in .env

// REGISTER (just for testing)
// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashed });

    // Create token
    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "User registered successfully",
      token
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Registration failed" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Wrong password" });

    // CREATE JWT TOKEN
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" } // beginner-friendly expiry
    );

    res.json({
      success: true,
      token,
      user: { email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// TOKEN VERIFICATION (for protected pages)
router.get("/verify", (req, res) => {
  try {
    const token = req.headers.authorization; // frontend sends token here

    if (!token)
      return res.json({ valid: false });

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({ valid: true, userId: decoded.userId });
  } catch (err) {
    res.json({ valid: false });
  }
});

module.exports = router;
