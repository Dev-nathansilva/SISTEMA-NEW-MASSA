import ClientesTable from "@/Tabelas/ClientesTable";
import { Box, Button } from "@chakra-ui/react";
import { BsPrinterFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";

export default function ClientesPage() {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 mb-3">
          <IoPeopleSharp className="text-[25px]" />{" "}
          <p className="title-session text-[20px]">
            Gerenciamento dos Clientes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Box className="container-icon-action">
            <Box className="icon">
              <BsPrinterFill color="black" />
            </Box>
          </Box>

          <Button
            className="bg-blue-600 text-white px-4 rounded-md"
            variant="solid"
          >
            <LuPlus /> Adicionar Novo
          </Button>
        </div>
      </div>
      <ClientesTable></ClientesTable>
    </div>
  );
}
