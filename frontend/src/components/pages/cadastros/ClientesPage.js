import ClientesTable from "@/Tabelas/ClientesTable";
import { IoPeopleSharp } from "react-icons/io5";

export default function ClientesPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <IoPeopleSharp className="text-[25px]" />{" "}
        <p className="title-session text-[20px]">Gerenciamento dos Clientes</p>
      </div>
      <ClientesTable></ClientesTable>
    </div>
  );
}
