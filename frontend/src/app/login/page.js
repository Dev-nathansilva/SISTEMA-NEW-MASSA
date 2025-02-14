"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Alert, Box, Flex, Input, Link, Text, Button } from "@chakra-ui/react";
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
import { FaAngleLeft } from "react-icons/fa";
import SavedAccounts from "@/components/SavedAccounts";
import LoginForm from "@/components/LoginForm";
import PasswordResetForm from "@/components/PasswordResetForm";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [savedUser, setSavedUser] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedUsers = Cookies.get("savedUsers");
    if (savedUsers) {
      setSavedUser(JSON.parse(savedUsers));
    }
    setIsLoadingUsers(false);
  }, []);

  const onSubmit = async (data) => {
    setError("");
    if (isSubmitting) return;

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
          Cookies.get("savedUsers")
            ? JSON.parse(Cookies.get("savedUsers")).map((user) => [
                user.token,
                user,
              ])
            : []
        );
        savedUsers.set(newUser.token, newUser);
        const updatedUsers = Array.from(savedUsers.values());

        Cookies.set("savedUsers", JSON.stringify(updatedUsers), {
          expires: 30,
          path: "/",
        });

        setSavedUser(updatedUsers);
      }

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    }
  };

  const deleteUser = (userToDelete) => {
    const savedUsers = Cookies.get("savedUsers")
      ? JSON.parse(Cookies.get("savedUsers"))
      : [];

    const updatedUsers = savedUsers.filter(
      (user) => user.token !== userToDelete.token
    );

    if (updatedUsers.length > 0) {
      Cookies.set("savedUsers", JSON.stringify(updatedUsers), {
        expires: 30,
        path: "/",
      });
    } else {
      Cookies.remove("savedUsers");
    }

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
          {isLoadingUsers ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : savedUser.length > 0 &&
            !showLoginForm &&
            !showPasswordResetForm ? (
            <SavedAccounts
              savedUser={savedUser}
              autoLogin={autoLogin}
              deleteUser={deleteUser}
              setShowLoginForm={setShowLoginForm}
            />
          ) : showPasswordResetForm ? (
            <PasswordResetForm
              setShowLoginForm={setShowLoginForm}
              setShowPasswordResetForm={setShowPasswordResetForm}
            />
          ) : (
            <LoginForm
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              savedUser={savedUser}
              setShowLoginForm={setShowLoginForm}
              setShowPasswordResetForm={setShowPasswordResetForm}
            />
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
