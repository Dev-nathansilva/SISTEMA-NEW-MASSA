const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Solicitação de redefinição de senha
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "email não cadastrado",
      });
    }

    // Gera o token e define a expiração
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    // Link de redefinição
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Envia o e-mail
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Redefinição de Senha",
      html: `<p>Clique no link para redefinir sua senha: <a href="${resetLink}">Redefinir Senha</a></p>`,
    });

    res.status(200).json({
      message:
        "você receberá as instruções para redefinir a senha, verifique sua caixa de entrada.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao solicitar redefinição de senha." });
  }
};

// 2. Redefinição de senha
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.status(200).json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao redefinir a senha." });
  }
};

// 3. verificaçao do token

exports.checkToken = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    res.status(200).json({ message: "Token válido." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao verificar o token." });
  }
};
