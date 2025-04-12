const express = require("express");
const router = express.Router();
const funcionariosController = require("../controllers/funcionariosController");

router.get("/funcionarios", funcionariosController.getAllFuncionarios);
router.post("/funcionarios", funcionariosController.createFuncionario);
router.put("/funcionarios/:id", funcionariosController.updateFuncionario);
router.delete("/funcionarios/:id", funcionariosController.deleteFuncionario);

module.exports = router;
