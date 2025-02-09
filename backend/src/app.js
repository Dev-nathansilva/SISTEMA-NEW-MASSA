const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);

app.use("/api", homeRoutes);

module.exports = app;
