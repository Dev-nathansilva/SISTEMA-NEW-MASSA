const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const prisma = new PrismaClient();

// Rota protegida
router.get("/home", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      message: "Bem-vindo à Home, usuário autenticado!",
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        nivel: user.nivel,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
