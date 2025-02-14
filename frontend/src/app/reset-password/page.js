"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Box, Button, Text, Flex, Alert } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { useForm } from "react-hook-form";
import { FiAlertOctagon } from "react-icons/fi";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams ? searchParams.get("token") : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSpinnerMessage, setIsSpinnerMessage] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null); // Estado para verificar a validade do token

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!token) {
        setErrorMessage(
          "Token inválido. Verifique o link recebido por e-mail."
        );
        setIsSpinnerMessage(true);
        setIsTokenValid(false); // Token inválido
        setTimeout(() => {
          router.push("/login");
        }, 1000);

        return;
      }

      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check-token`, {
          token,
        });
        setIsTokenValid(true); // Token válido
      } catch (error) {
        setErrorMessage("Token expirado ou inválido. Você será redirecionado.");
        setIsSpinnerMessage(true);
        setIsTokenValid(false); // Token inválido
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    };

    checkTokenValidity();
  }, [token, router]);

  const onSubmit = async (data) => {
    const { newPassword, confirmPassword } = data;

    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");

      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`,
        {
          token,
          newPassword,
        }
      );
      setSuccessMessage("Senha redefinida com sucesso! Redirecionando...");
      setIsSpinnerMessage(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage("Erro ao redefinir a senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se o token for inválido ou ainda não validado, exibe um loading
  if (isTokenValid === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center"></div>
    );
  }

  // Se o token for inválido, exibe a mensagem de erro e redireciona
  if (isTokenValid === false) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Alert.Root
          status="error"
          position="absolute"
          width="auto"
          zIndex="9999"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            top: "30px",
          }}
        >
          <Alert.Indicator>
            {isSpinnerMessage && <Spinner size="sm" />}
          </Alert.Indicator>
          <Alert.Title>{errorMessage}</Alert.Title>
        </Alert.Root>
      </div>
    );
  }

  // Quando o token é válido, exibe o formulário de redefinição de senha
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="flex min-h-screen w-full">
        <div className="w-[60%]">
          <Image
            src="/banner-newmassa.jpg"
            alt="Banner"
            width={2112}
            height={2080}
            className="object-cover w-full h-screen"
          />
        </div>

        <div className="w-[40%] flex items-center justify-center p-8 relative">
          <div className="max-w-sm w-full">
            <h2 className="title-login">Redefinir Senha</h2>
            <p className="description-login">Defina sua nova senha abaixo.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Nova Senha">
                <InputGroup className="w-full flex items-center" flex="1">
                  <PasswordInput
                    className={`input-padrao flex-1 ${
                      errors.newPassword ? "input-error" : ""
                    }`}
                    padding="1rem"
                    placeholder="Digite a nova senha"
                    size="lg"
                    {...register("newPassword", {
                      required: "A nova senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "A senha deve ter pelo menos 6 caracteres",
                      },
                    })}
                  />
                </InputGroup>
                {errors.newPassword && (
                  <Text color="red.500" fontSize="sm">
                    {errors.newPassword.message}
                  </Text>
                )}
              </Field>

              <Field label="Confirme a Nova Senha">
                <InputGroup className="w-full flex items-center" flex="1">
                  <PasswordInput
                    className={`input-padrao flex-1 ${
                      errors.confirmPassword ? "input-error" : ""
                    }`}
                    padding="1rem"
                    placeholder="Confirme a nova senha"
                    size="lg"
                    {...register("confirmPassword", {
                      required: "Por favor, confirme a nova senha",
                      minLength: {
                        value: 6,
                        message: "A senha deve ter pelo menos 6 caracteres",
                      },
                    })}
                  />
                </InputGroup>
                {errors.confirmPassword && (
                  <Text color="red.500" fontSize="sm">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </Field>

              <Button
                type="submit"
                size="xl"
                className="w-full bg-[#1570EF] text-white rounded hover:bg-blue-700"
                variant="solid"
                isLoading={isSubmitting}
                loadingText="Redefinindo..."
                spinner={<Spinner />}
              >
                Redefinir Senha
              </Button>
            </form>

            {successMessage && (
              <Alert.Root
                status="success"
                position="absolute"
                width="auto"
                zIndex="9999"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "30px",
                }}
              >
                <Alert.Indicator>
                  {isSpinnerMessage && <Spinner size="sm" />}
                </Alert.Indicator>
                <Alert.Title>{successMessage}</Alert.Title>
              </Alert.Root>
            )}

            {errorMessage && (
              <Alert.Root
                status="error"
                position="absolute"
                width="auto"
                zIndex="9999"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "30px",
                }}
              >
                <Alert.Indicator>
                  {!isSpinnerMessage && (
                    <Box
                      as="span"
                      className="chakra-alert__icon"
                      role="img"
                      aria-label="Error icon"
                    >
                      <FiAlertOctagon />
                    </Box>
                  )}
                  {isSpinnerMessage && <Spinner size="sm" />}
                </Alert.Indicator>
                <Alert.Title>{errorMessage}</Alert.Title>
              </Alert.Root>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
