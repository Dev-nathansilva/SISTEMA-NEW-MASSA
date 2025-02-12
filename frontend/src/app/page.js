import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = res.data.user;

    return (
      <div>
        <h2>Bem-vindo {user?.name}!</h2>
        <p>{user?.email}</p>

        <form action="/api/logout" method="POST">
          <button type="submit">Sair</button>
        </form>
      </div>
    );
  } catch (error) {
    redirect("/login");
  }
}
