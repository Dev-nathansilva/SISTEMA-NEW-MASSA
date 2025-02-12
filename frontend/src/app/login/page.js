"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Alert,
  Box,
  Flex,
  Input,
  Link,
  Text,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { LuUser } from "react-icons/lu";
import { HiUser } from "react-icons/hi2";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { FaLock } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { TbLogin2 } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { Tooltip } from "@/components/ui/tooltip";
import Spinner from "@/components/Spinner";
import { FaTrash } from "react-icons/fa";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [savedUser, setSavedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || [];
    setSavedUser(savedUsers);
  }, []);

  const onSubmit = async (data) => {
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        {
          email: data.email,
          password: data.password,
        }
      );
      // Salva o token no cookie
      Cookies.set("token", res.data.token, { expires: 1 });

      console.log("estado do switch:", rememberMe);
      console.log("res-data:", res.data.user.name);

      if (rememberMe) {
        const newUser = { name: res.data.user.name, token: res.data.token };
        const savedUsers = new Map(
          JSON.parse(localStorage.getItem("savedUsers"))?.map((user) => [
            user.token,
            user,
          ]) || []
        );
        savedUsers.set(newUser.token, newUser);
        const updatedUsers = Array.from(savedUsers.values());
        localStorage.setItem("savedUsers", JSON.stringify(updatedUsers));
        setSavedUser(updatedUsers);
      }

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    }
  };

  const deleteUser = (userToDelete) => {
    const savedUsers = new Map(
      JSON.parse(localStorage.getItem("savedUsers"))?.map((user) => [
        user.token,
        user,
      ]) || []
    );
    savedUsers.delete(userToDelete.token);
    const updatedUsers = Array.from(savedUsers.values());
    localStorage.setItem("savedUsers", JSON.stringify(updatedUsers));
    setSavedUser(updatedUsers);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const autoLogin = async (token) => {
    Cookies.set("token", token, { expires: 1 });
    router.push("/");
  };

  return (
    <div className=" flex min-h-screen w-full">
      <div className="w-[60%]">
        <Image
          src="/banner-newmassa.jpg"
          alt="Descrição da imagem"
          width={2112}
          height={2080}
          className="object-cover w-full h-screen"
        />
      </div>

      <div className="w-[40%] flex items-center justify-center p-8 relative">
        <div className="max-w-sm w-full">
          <h2 className="title-login">Login</h2>
          <p className="description-login">
            Por favor, preencha as informações abaixo.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="">
              <InputGroup
                className="w-full flex items-center "
                flex="1"
                startElement={<LuUser className="text-lg" />}
              >
                <Input
                  className={`input-padrao flex-1 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="Usuário"
                  size="lg"
                  type="email"
                  {...register("email", {
                    required: "O email é obrigatório",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Formato de email inválido",
                    },
                  })}
                />
              </InputGroup>
              {errors.email && (
                <Text color="red.500" fontSize="sm">
                  {errors.email.message}
                </Text>
              )}
            </Field>

            <Field label="">
              <InputGroup
                className="w-full flex items-center"
                flex="1"
                startElement={<FaLock className="text-md" />}
              >
                <PasswordInput
                  className={`input-padrao flex-1 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Senha"
                  size="lg"
                  {...register("password", {
                    required: "A senha é obrigatória",
                  })}
                />
              </InputGroup>
              {errors.password && (
                <Text color="red.500" fontSize="sm">
                  {errors.password.message}
                </Text>
              )}
            </Field>

            <Button
              type="submit"
              size="xl"
              className="w-full bg-[#1570EF] text-white rounded hover:bg-blue-700"
              variant="solid"
              loading={isSubmitting}
              loadingText="Acessando..."
              spinner={<Spinner />}
            >
              Acessar <TbLogin2 className="mt-[3px]" />
            </Button>

            <Flex justify="space-between" align="center" id="group-actions">
              <Flex align="center">
                <Switch
                  id="remember-me"
                  className="mt-[2px]"
                  checked={rememberMe}
                  onCheckedChange={(e) => setRememberMe(e.checked)}
                />
                <Text className="remember-me" ml={2}>
                  Lembrar de mim
                </Text>
              </Flex>
              <Link href="/esqueci-minha-senha" color="blue.500">
                Esqueci minha senha
              </Link>
            </Flex>
          </form>

          {savedUser && savedUser.length > 0 && (
            <div>
              {savedUser.map((user) => (
                <div
                  key={user.token}
                  className="flex justify-between cursor-pointer p-4 border rounded-lg mt-4 bg-[#F9FAFB] hover:bg-gray-200 transition"
                >
                  <Flex align="center">
                    <HiUser className="text-xl mr-2" />
                    <Text fontSize="lg">
                      <span className="text-[#9d9d9d] mr-1">Conta:</span>{" "}
                      {user.name}
                    </Text>
                  </Flex>

                  <Button
                    className="p-4"
                    variant="ghost" // Usando um botão transparente
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Impede que o clique no ícone dispare o login
                      deleteUser(user); // Chama a função para deletar o usuário
                    }}
                    aria-label="Excluir usuário" // Descrição para acessibilidade
                  >
                    <FaTrash className="text-red-500 " />{" "}
                    {/* Ícone da lixeira com cor vermelha */}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Box
            mt={4}
            textAlign="center"
            className="absolute bottom-12"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            <Text
              fontSize="md"
              className="flex justify-center align-center gap-2 rodape-text"
            >
              © desenvolvido por{" "}
              <Box as="span" display="inline-flex" alignItems="center">
                <Image
                  src="/logo-nathandev.png"
                  alt="Logo da Empresa"
                  height={42}
                  width={214}
                  style={{ height: "25px", width: "auto", marginLeft: "4px" }}
                />
              </Box>
            </Text>
          </Box>
        </div>

        <Tooltip
          showArrow
          delay={0}
          openDelay={0}
          closeDelay={200}
          content="Acesso dos Motoristas"
          contentProps={{ css: { "--tooltip-bg": "black" } }}
        >
          <Link
            className="absolute top-4 right-9 bg-[#F3F3F3] hover:bg-[#E3E3E3] p-4 rounded-xl border border-gray-400"
            href="/motoristas"
          >
            <Image
              src="/caminhao.svg"
              alt="Acesso dos motoristas"
              height={37}
              width={37}
            />
          </Link>
        </Tooltip>

        {error && (
          <Alert.Root
            status="error"
            position="absolute"
            width="auto"
            zIndex="9999"
            style={{ left: "50%", transform: "translateX(-50%)", top: "30px" }}
          >
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}
      </div>
    </div>
  );
}
