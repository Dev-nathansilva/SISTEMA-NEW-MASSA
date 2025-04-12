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

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);

app.use("/api", homeRoutes);

app.use("/api", passwordResetRoutes);

app.use("/api", VerifyTokenRoutes);

app.use("/api", clientesRoutes);

app.use("/api", vendedoresRoutes);

app.use("/api", fornecedoresRoutes);

app.use("/api", funcionariosRoutes);

app.get("/", (req, res) => {
  res.send("Backend rodando corretamente!");
});

module.exports = app;
