// routes/backupRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MODELOS = [
  "cliente",
  "user",
  "fornecedor",
  "vendedor",
  "funcionario",
  "produto",
];

router.get("/backup", async (req, res) => {
  try {
    const backupDir = path.resolve("backup");

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    for (const modelo of MODELOS) {
      const dados = await prisma[modelo].findMany();
      const filePath = path.join(backupDir, `${modelo}.json`);
      fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
    }

    await prisma.$disconnect();
    res.status(200).json({ message: "Backup realizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao gerar backup:", error);
    res.status(500).json({ error: "Erro ao gerar backup" });
  }
});

module.exports = router;
