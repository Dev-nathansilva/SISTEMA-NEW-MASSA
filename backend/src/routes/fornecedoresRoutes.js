const express = require("express");
const router = express.Router();
const fornecedoresController = require("../controllers/fornecedoresController");

router.get("/fornecedores", fornecedoresController.getAllFornecedores);
router.post("/fornecedores", fornecedoresController.createFornecedor);
router.put("/fornecedores/:id", fornecedoresController.updateFornecedor);
router.delete("/fornecedores/:id", fornecedoresController.deleteFornecedor);

module.exports = router;
