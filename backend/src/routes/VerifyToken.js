const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/verify-token", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
