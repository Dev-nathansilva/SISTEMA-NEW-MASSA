const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");

router.post("/password-reset", passwordResetController.requestPasswordReset);
router.post("/reset-password", passwordResetController.resetPassword);
router.post("/check-token", passwordResetController.checkToken);

module.exports = router;
