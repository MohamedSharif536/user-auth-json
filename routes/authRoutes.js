const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected test route
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

module.exports = router;
