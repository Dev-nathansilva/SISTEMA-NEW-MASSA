"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button, HStack } from "@chakra-ui/react";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        Cookies.remove("token");
        router.push("/login");
      });
  }, [router]);

  // Só renderiza a página se o user estiver definido
  if (!user) {
    return null; // Não renderiza nada enquanto o usuário não for carregado
  }

  return (
    <div>
      <h2>Bem-vindo {user?.name}!</h2>
      <button
        onClick={() => {
          Cookies.remove("token");
          router.push("/login");
        }}
      >
        Sair
      </button>

      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>
    </div>
  );
}
