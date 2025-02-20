const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { JWT_SECRET } = require("../config");

const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};

const authenticateUser = async (email, password, rememberMe) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado!");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Senha incorreta!");

  const expiresIn = rememberMe ? "30d" : "1h";

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: expiresIn,
  });
  return { token, user: { name: user.name } };
};

module.exports = {
  createUser,
  authenticateUser,
};
