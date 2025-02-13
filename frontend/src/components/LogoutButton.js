"use client";

import { Toaster, toaster } from "@/components/ui/toaster";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        toaster.create({
          title: "Logout realizado com sucesso!",
          type: "success",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        throw new Error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Erro ao fazer logout",
        type: "error",
      });
    }
  };

  return (
    <>
      <button onClick={handleLogout}>Sair</button>
      <Toaster />
    </>
  );
}
