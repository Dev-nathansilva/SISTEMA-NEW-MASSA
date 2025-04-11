import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../components/CustomTable";
import debounce from "lodash.debounce";

import {
  BsChevronExpand,
  BsFillCaretUpFill,
  BsFillCaretDownFill,
} from "react-icons/bs";
import { LuListFilter } from "react-icons/lu";
import { FiMail, FiEdit, FiTrash2 } from "react-icons/fi";
import usePopupManager from "../hooks/popupmanager";
import { useCallback } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "../../src/styles/Pages.css";

const filtrosIniciais = {
  status: [],
  tipo: [],
  dataInicial: null,
  dataFinal: null,
};

export default function ClientesTable() {
  const [clientes, setClientes] = useState([]);
  const [enableResizing, setEnableResizing] = useState(false);
  const [columnSizes, setColumnSizes] = useState({});
  const [filters, setFilters] = useState(filtrosIniciais);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSearchHandler = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  const filterConfig = useMemo(
    () => [
      {
        key: "status",
        label: "Status",
        options: [
          { value: "Ativo", label: "Ativo" },
          { value: "Inativo", label: "Inativo" },
        ],
      },
      {
        key: "tipo",
        label: "Tipo",
        options: [
          { value: "PessoaFisica", label: "Pessoa Física" },
          { value: "PessoaJuridica", label: "Pessoa Jurídica" },
          { value: "Empresa", label: "Empresa" },
        ],
      },
    ],
    []
  );

  const [hiddenColumns, setHiddenColumns] = useState([
    "Email",
    "Inscricao Estadual",
    "Data de Cadastro",
  ]);

  //PAGINAÇÃO

  const [totalItens, setTotalItens] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  useEffect(() => {
    const updateHiddenColumns = () => {
      const width = window.innerWidth;
      let newHiddenColumns = [];

      if (width <= 1140) {
        newHiddenColumns = ["Email", "Inscricao Estadual", "Data de Cadastro"];
      } else if (width <= 1339) {
        newHiddenColumns = [
          "Email",
          "Inscricao Estadual",
          "Data de Cadastro",
          "CPF/CNPJ",
        ];
      } else if (width <= 1639) {
        newHiddenColumns = ["Email", "Inscricao Estadual", "Data de Cadastro"];
      } else if (width <= 1920) {
        newHiddenColumns = ["Inscricao Estadual", "Data de Cadastro"];
      } else {
        newHiddenColumns = [];
      }

      setHiddenColumns(newHiddenColumns);
    };

    updateHiddenColumns();

    window.addEventListener("resize", updateHiddenColumns);
    return () => {
      window.removeEventListener("resize", updateHiddenColumns);
    };
  }, []);

  const toggleFilterValue = (filterKey, value) => {
    setFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };
  const popupKeys = [...filterConfig.map((f) => f.key), "dataCadastro"];

  const { popupStates, popupRefs, togglePopup } = usePopupManager(popupKeys);

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: paginaAtual,
          limit: itensPorPagina,
          search: debouncedSearch,
        });

        // Adicionando os filtros
        if (filters.status.length > 0) {
          filters.status.forEach((status) => params.append("status", status));
        }

        if (filters.tipo.length > 0) {
          filters.tipo.forEach((tipo) => params.append("tipo", tipo));
        }

        const response = await fetch(
          `http://localhost:5000/api/clientes?${params.toString()}`
        );
        const data = await response.json();

        const mappedData = data.data.map((cliente) => ({
          id: cliente.id,
          Nome: cliente.nome,
          "CPF/CNPJ": cliente.documento,
          tipo:
            {
              PessoaFisica: "Pessoa Física",
              PessoaJuridica: "Pessoa Jurídica",
              Empresa: "Empresa",
            }[cliente.tipo] || cliente.tipo,
          status: cliente.status,
          teste: "",
          Email: cliente.email,
          "Inscricao Estadual": cliente.inscricaoEstadual,
          "Data de Cadastro": formatarData(cliente.dataCadastro),
          dataCadastroRaw: cliente.dataCadastro,
        }));

        setClientes(mappedData);
        setTotalPaginas(data.totalPages);
        setTotalItens(data.total);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchData();
  }, [debouncedSearch, paginaAtual, itensPorPagina, filters]);

  const renderFilterHeader = useCallback(
    (key) => {
      const config = filterConfig.find((f) => f.key === key);
      const selected = filters[key] || [];
      const isSelected = selected.length > 0;

      return (
        <div className="relative gap-3 flex items-center">
          <span>{config.label}</span>
          <div
            className={`cursor-pointer filter-icon p-1 rounded-[4px] ${
              isSelected ? "bg-blue-200" : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => togglePopup(key)}
          >
            <LuListFilter
              className={` ${isSelected ? "text-blue-900" : "text-black"}`}
            />
          </div>
          {popupStates[key] && (
            <div
              ref={popupRefs[key]}
              className="absolute top-9 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4"
            >
              <h2 className="text-sm font-semibold mb-2">
                Filtrar por {config.label}
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                {config.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() => toggleFilterValue(key, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    },
    [filters, popupStates, popupRefs, togglePopup, filterConfig]
  );

  const renderDateRangeFilterHeader = useCallback(() => {
    const isActive = filters.dataInicial || filters.dataFinal;

    return (
      <div className="relative gap-3 flex items-center">
        <span>Data de Cadastro</span>
        <div
          className={`cursor-pointer filter-icon p-1 rounded-[4px] ${
            isActive ? "bg-blue-200" : "bg-gray-100 hover:bg-gray-300"
          }`}
          onClick={() => togglePopup("dataCadastro")}
        >
          <FaRegCalendarAlt
            className={`text-[15px]  ${
              isActive ? "text-blue-900" : "text-black"
            }`}
          />
        </div>

        {popupStates["dataCadastro"] && (
          <div
            ref={popupRefs["dataCadastro"]}
            className="absolute top-9 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4"
          >
            <h2 className="text-sm font-semibold mb-2">
              Filtrar por intervalo
            </h2>
            <div className="flex flex-col gap-2 text-sm">
              <label>
                Data Inicial:
                <input
                  type="date"
                  className="w-full border px-2 py-1 rounded mt-1"
                  value={filters.dataInicial || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dataInicial: e.target.value || null,
                    }))
                  }
                />
              </label>
              <label>
                Data Final:
                <input
                  type="date"
                  className="w-full border px-2 py-1 rounded mt-1"
                  value={filters.dataFinal || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dataFinal: e.target.value || null,
                    }))
                  }
                />
              </label>
              {(filters.dataInicial || filters.dataFinal) && (
                <button
                  className="mt-2 text-xs text-blue-500 underline"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dataInicial: null,
                      dataFinal: null,
                    }))
                  }
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }, [
    filters.dataInicial,
    filters.dataFinal,
    popupStates,
    popupRefs,
    togglePopup,
  ]);

  const [columnOrder, setColumnOrder] = useState([
    "Selecionar",
    "Nome",
    "tipo",
    "CPF/CNPJ",
    "status",
    "Email",
    "Inscricao Estadual",
    "Data de Cadastro",
    "ações",
  ]);

  // Componente reutilizável para cabeçalhos ordenáveis
  function SortableHeaderButton({ label, column }) {
    return (
      <button
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => {
          if (column.getIsSorted() === "desc") {
            column.clearSorting();
          } else {
            column.toggleSorting(column.getIsSorted() === "asc");
          }
        }}
      >
        {label}{" "}
        {column.getIsSorted() === "asc" ? (
          <BsFillCaretUpFill />
        ) : column.getIsSorted() === "desc" ? (
          <BsFillCaretDownFill />
        ) : (
          <BsChevronExpand />
        )}
      </button>
    );
  }

  const columns = useMemo(() => {
    const baseColumns = [
      // COLUNA SELECIONAR
      {
        id: "Selecionar",
        accessorKey: "⬜",
        enableResizing,
        header: ({ table }) => (
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 70,
      },
      // COLUNA NOME
      {
        id: "Nome",
        accessorKey: "Nome",
        header: ({ column }) => (
          <SortableHeaderButton label="Nome" column={column} />
        ),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },
      // COLUNA CPF/CNPJ
      {
        id: "CPF/CNPJ",
        accessorKey: "CPF/CNPJ",

        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },
      // COLUNA TIPO
      {
        id: "tipo",
        accessorKey: "tipo",
        header: () => renderFilterHeader("tipo"),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },
      // COLUNA STATUS
      {
        id: "status",
        accessorKey: "status",
        header: () => renderFilterHeader("status"),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
        cell: ({ getValue }) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              getValue() === "Ativo"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {getValue()}
          </span>
        ),
      },
      // COLUNA AÇÕES
      {
        id: "ações",
        accessorKey: "Ações",
        header: "Ações",
        cell: () => (
          <div className="flex gap-2 text-lg">
            <FiMail className="cursor-pointer text-black" />
            <FiEdit className="cursor-pointer text-orange-500" />
            <FiTrash2 className="cursor-pointer text-red-500" />
          </div>
        ),
        enableResizing,
        size: 150,
        minSize: 150,
      },
      // COLUNA EMAIL
      {
        id: "Email",
        header: "Email",
        accessorKey: "Email",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA INSCRIÇÃO ESTADUAL
      {
        id: "Inscricao Estadual",
        header: "Inscricao Estadual",
        accessorKey: "Inscricao Estadual",
        enableHiding: true,
        minSize: 200,
      },
      // COLUNA DATA DE CADASTRO
      {
        id: "Data de Cadastro",
        accessorKey: "Data de Cadastro",
        enableHiding: true,
        minSize: 300,
      },
    ];

    return columnOrder
      .map((colId) => baseColumns.find((col) => col.id === colId))
      .filter(Boolean);
  }, [
    columnOrder,
    enableResizing,
    columnSizes,
    renderFilterHeader,
    renderDateRangeFilterHeader,
  ]);

  function BotaoLimparFiltros({ onClick }) {
    return (
      <button
        className="cursor-pointer rounded text-sm font-medium text-gray-400 hover:text-gray-600 flex items-center gap-2"
        onClick={onClick}
      >
        <IoClose /> Limpar Filtros
      </button>
    );
  }

  const temFiltrosAtivos = useMemo(() => {
    const algumFiltroSelecionado = Object.entries(filters).some(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== "";
    });

    return algumFiltroSelecionado;
  }, [filters]);

  return (
    <div>
      <CustomTable
        data={clientes}
        columns={columns}
        setColumnOrder={setColumnOrder}
        enableResizing={enableResizing}
        setEnableResizing={setEnableResizing}
        initiallyHiddenColumns={hiddenColumns}
        extraHeaderContent={
          temFiltrosAtivos ? (
            <BotaoLimparFiltros onClick={() => setFilters(filtrosIniciais)} />
          ) : null
        }
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        setPaginaAtual={setPaginaAtual}
        totalItens={totalItens}
        itensPorPagina={itensPorPagina}
        onChangeItensPorPagina={(value) => {
          setItensPorPagina(value);
          setPaginaAtual(1);
        }}
        search={search}
        onSearchChange={setSearch}
        debouncedSearchHandler={debouncedSearchHandler}
      />
    </div>
  );
}
