const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const passwordResetRoutes = require("./routes/passwordReset");
const VerifyTokenRoutes = require("./routes/VerifyToken");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);

app.use("/api", homeRoutes);

app.use("/api", passwordResetRoutes);

app.use("/api", VerifyTokenRoutes);

app.get("/", (req, res) => {
  res.send("Backend rodando corretamente!");
});

module.exports = app;
