// src/controllers/userController.js
const UserService = require("../services/userService");

const register = async (req, res) => {
  const data = req.body;
  try {
    const user = await UserService.createUser(data);
    res.json({ message: "Usuário criado!", user });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ error: "Erro ao criar usuário. Verifique os dados enviados." });
  }
};

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const { token, user } = await UserService.authenticateUser(
      email,
      password,
      rememberMe
    );
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
