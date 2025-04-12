const express = require("express");
const router = express.Router();
const vendedoresController = require("../controllers/vendedoresController");

router.get("/vendedores", vendedoresController.getAllVendedores);
router.post("/vendedores", vendedoresController.createVendedor);
router.put("/vendedores/:id", vendedoresController.updateVendedor);
router.delete("/vendedores/:id", vendedoresController.deleteVendedor);

module.exports = router;
