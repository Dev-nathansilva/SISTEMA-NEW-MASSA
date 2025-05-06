const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const passwordResetRoutes = require("./routes/passwordReset");
const VerifyTokenRoutes = require("./routes/VerifyToken");
const clientesRoutes = require("./routes/clienteRoutes");
const vendedoresRoutes = require("./routes/vendedoresRoutes");
const fornecedoresRoutes = require("./routes/fornecedoresRoutes");
const funcionariosRoutes = require("./routes/funcionariosRoutes");
const backupRoutes = require("./routes/backupRoutes");
const produtoRoutes = require("./routes/produtoRoutes");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api", userRoutes);

app.use("/api", homeRoutes);

app.use("/api", passwordResetRoutes);

app.use("/api", VerifyTokenRoutes);

app.use("/api", clientesRoutes);

app.use("/api", vendedoresRoutes);

app.use("/api", fornecedoresRoutes);

app.use("/api", funcionariosRoutes);

app.use("/api", backupRoutes);

app.use("/api", produtoRoutes);

app.get("/", (req, res) => {
  res.send("Backend rodando corretamente!");
});

module.exports = app;
