"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login"; // Redirecionamento manual
  };

  return <button onClick={handleLogout}>Sair</button>;
}
