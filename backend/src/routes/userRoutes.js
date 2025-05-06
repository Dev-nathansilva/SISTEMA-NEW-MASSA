const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { upload } = require("../middlewares/upload");

router.post("/usuarios", upload.single("fotoPerfil"), userController.register);
router.post("/login", userController.login);
router.get("/usuarios", userController.getAllUsuarios);
router.put(
  "/usuarios/:id",
  upload.single("fotoPerfil"),
  userController.updateUsuario
);
router.delete("/usuarios/:id", userController.deleteUsuario);

module.exports = router;
