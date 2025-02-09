// src/controllers/userController.js
const UserService = require("../services/userService");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserService.createUser(name, email, password);
    res.json({ message: "Usuário criado!", user });
  } catch (error) {
    res.status(400).json({ error: "Email já está em uso." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await UserService.authenticateUser(email, password);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
