const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

// Rota protegida
router.get("/home", authenticateToken, (req, res) => {
  res.json({
    message: "Bem-vindo à Home, usuário autenticado!",
    user: req.user,
  });
});

module.exports = router;
