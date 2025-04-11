import React, { useEffect, useRef, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { FiAlertOctagon, FiSearch } from "react-icons/fi";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

import { IoBrowsersOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import usePopupManager from "../hooks/popupmanager";
import { LuSettings2 } from "react-icons/lu";
import { Input, InputGroup } from "@chakra-ui/react";

export default function CustomTable({
  data,
  setColumnOrder,
  columns,
  enableResizing,
  setEnableResizing,
  initiallyHiddenColumns,
  extraHeaderContent,
  totalItens,
  itensPorPagina,
  onChangeItensPorPagina,
  paginaAtual,
  totalPaginas,
  setPaginaAtual,
  search,
  onSearchChange,
  debouncedSearchHandler,
}) {
  const [columnFilters] = useState([]);
  const [enableDragging, setEnableDragging] = useState(false);

  const popupKeys = ["func", "columns"];
  const { popupStates, popupRefs, togglePopup, closePopup } =
    usePopupManager(popupKeys);

  // EFEITO DE ARRASTAR AS COLUNAS (DRAG)
  const onDragEnd = (event) => {
    if (!enableDragging) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setColumnOrder((prevOrder) => {
      const oldIndex = prevOrder.indexOf(active.id);
      const newIndex = prevOrder.indexOf(over.id);
      return arrayMove(prevOrder, oldIndex, newIndex);
    });
  };
  function DraggableHeader({ column }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: column.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...(enableDragging ? { ...attributes, ...listeners } : {})} // Aplica listeners somente se enableDragging for true
        className={`px-3 py-4  text-left font-semibold border border-gray-200  ${
          enableDragging ? "cursor-move" : "cursor-default"
        } bg-[#f9f9f9]`}
      >
        {enableDragging ? "⠿ " : ""} {column.columnDef?.accessorKey}
      </div>
    );
  }

  // COLUNAS VISÍVEIS
  const [visibleColumns, setVisibleColumns] = useState(() =>
    columns.reduce((acc, col) => {
      acc[col.id] = !initiallyHiddenColumns.includes(col.id);
      return acc;
    }, {})
  );
  // MOSTRAR COLUNAS OCULTAS
  const toggleColumnVisibility = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));

    table.getColumn(columnId)?.toggleVisibility();
  };

  //   TABELA (useReactTable)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      columnVisibility: visibleColumns,
    },
    onColumnVisibilityChange: setVisibleColumns,
    enableColumnResizing: enableResizing,
    columnResizeMode: "onChange",
  });

  // REDIMENSIONAMENTO
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (resizeHandler) => (event) => {
    setIsResizing(true);
    resizeHandler(event);

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mouseup", handleMouseUp);
  };

  // EFEITO SCROLL

  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDownScroll = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("dragging");
  };

  const handleMouseLeaveScroll = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("dragging");
  };

  const handleMouseUpScroll = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("dragging");
  };

  const handleMouseMoveScroll = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.0; // menor fator = mais controlado
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    setVisibleColumns((prev) => {
      const updated = { ...prev };
      columns.forEach((col) => {
        updated[col.id] = !initiallyHiddenColumns.includes(col.id);
      });
      return updated;
    });
  }, [initiallyHiddenColumns, columns]);

  return (
    <div className=" relative">
      <div className="relative flex gap-3 items-center">
        {/* CAMPO DE PESQUISA */}
        <div className="w-[400px] ">
          <InputGroup
            flex="1"
            startElement={<FiSearch className="text-gray-400" />}
          >
            <Input
              type="text"
              className="input-pesquisa focus-visible:outline-gray-400 text-gray-400"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
                debouncedSearchHandler(e.target.value);
              }}
            />
          </InputGroup>
        </div>
        {/* <button className="px-4 py-3 bg-black text-white rounded-md">
          Filtros
        </button> */}

        <div className="relative">
          <button
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-black rounded-[10px] text-[20px] border border-gray-300"
            onClick={() => togglePopup("func")}
          >
            <LuSettings2 />
          </button>
          {popupStates.func && (
            <div
              ref={popupRefs.func}
              className="absolute z-[1000] mt-2 w-[500px] bg-white border border-gray-300 shadow-xl rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Funcionalidades</h2>
                <button onClick={() => closePopup("func")}>✖</button>
              </div>

              {/* Conteúdo de funcionalidades aqui */}
              <div className="flex flex-col gap-4">
                {/* Redimensionamento */}
                <div className="flex gap-2 items-center">
                  <input
                    className="switch"
                    type="checkbox"
                    checked={enableResizing}
                    onChange={() => setEnableResizing((prev) => !prev)}
                  />
                  <span>Redimensionamento</span>
                </div>

                {/* Reordenação */}
                <div className="flex gap-2 items-center">
                  <input
                    className="switch"
                    type="checkbox"
                    checked={enableDragging}
                    onChange={() => setEnableDragging((prev) => !prev)}
                  />
                  <span>Ativar Reordenação de Colunas</span>
                </div>

                {/* OCULTAR / EXIBIR */}
                <div className="relative inline-block">
                  <button
                    onClick={() => togglePopup("columns")}
                    className="flex items-center gap-3 px-4 py-2 bg-black text-white rounded-md"
                  >
                    Ocultar/Exibir Colunas <IoIosArrowForward />
                  </button>

                  {popupStates.columns && (
                    <div
                      ref={popupRefs.columns}
                      className="absolute z-[1000] mr-[-33px] right-0 top-0 w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4"
                    >
                      {/* Checkbox para selecionar/desmarcar todas as colunas */}
                      <label className="block font-medium mb-2">
                        <input
                          type="checkbox"
                          checked={Object.values(visibleColumns).every(Boolean)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const updatedColumns = {};
                            columns.forEach((col) => {
                              updatedColumns[col.id] = isChecked;
                            });
                            setVisibleColumns(updatedColumns);
                          }}
                          className="mr-2"
                        />
                        Selecionar/Desmarcar Tudo
                      </label>

                      {/* Checkboxes individuais para cada coluna */}
                      {columns.map((col) => (
                        <label key={col.id} className="block">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col.id]}
                            onChange={() => toggleColumnVisibility(col.id)}
                            className="mr-2"
                          />
                          {col.id}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {extraHeaderContent ? <div>{extraHeaderContent}</div> : <div></div>}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-700">Total: {totalItens}</span>
        <div className="flex items-center gap-2">
          <label htmlFor="itensPorPagina" className="text-sm text-gray-700">
            Itens por página:
          </label>
          <select
            id="itensPorPagina"
            value={itensPorPagina}
            onChange={(e) => onChangeItensPorPagina(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[5, 10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contêiner de tabela com overflow-x-auto */}
      {/* mx-auto min-h-[350px] max-h-[450px] w-full */}
      <div
        ref={scrollRef}
        className={`scroll-container min-h-[40vh] max-h-[55vh] ${
          isDragging ? "dragging" : ""
        }`}
        onMouseDown={handleMouseDownScroll}
        onMouseLeave={handleMouseLeaveScroll}
        onMouseUp={handleMouseUpScroll}
        onMouseMove={handleMouseMoveScroll}
      >
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={columns.map((col) => col.id)}>
            {/* w-full min-w-fit */}

            <table className="min-w-full border-spacing-y-3 border-separate  relative">
              <thead className="bg-[#f5f5f6] sticky top-[12px] mt-[-12px] thead-table z-50 ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`bg-[#fcfcfc] ${
                          enableDragging
                            ? ""
                            : "p-4 border-y border-[#eff0f1] first:border first:border-r-transparent first:border-l-[#eff0f1] last:border last:border-l-transparent last:border-r-[#eff0f1]"
                        } text-left font-semibold relative first:rounded-l-[10px] 
                        last:rounded-r-[10px]   text-[#1f383c] `}
                        style={{
                          minWidth: header.getSize(),
                          width: header.getSize(),
                          maxWidth: header.getSize(),
                        }}
                      >
                        {enableDragging ? (
                          <DraggableHeader column={header.column}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </DraggableHeader>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                        {/* Div para arrastar e redimensionar */}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={handleMouseDown(
                              header.getResizeHandler()
                            )}
                            onTouchStart={handleMouseDown(
                              header.getResizeHandler()
                            )}
                            className="absolute right-0 w-[3px] h-6 cursor-ew-resize bg-[#dcdcdc] rounded-4xl mr-1"
                            style={{
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          ></div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className=" border-[#e7e7e7] rounded-[10px] p-4 text-gray-500 text-center"
                    >
                      <FiAlertOctagon className="inline-block mr-2 mt-[-2px]" />{" "}
                      Nenhum item encontrado
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={` rounded-[10px] shadow-xs  ${
                        row.getIsSelected()
                          ? "bg-blue-100"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {row.getVisibleCells().map((cell, index, array) => (
                        <td
                          key={cell.id}
                          title={String(cell.getValue() ?? "")}
                          className={`max-w-[20px] truncate p-5 text-left  border-y border-[#e0e0e0] first:border 
                        first:border-r-transparent first:border-l-[#e0e0e0] 
                        last:border last:border-l-transparent last:border-r-[#e0e0e0] ${
                          index === 0 ? "rounded-l-[10px]" : ""
                        } ${
                            index === array.length - 1 ? "rounded-r-[10px]" : ""
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
      {/* Navegação: Paginação */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaAtual === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {paginaAtual} de {totalPaginas}
        </span>
        <button
          onClick={() =>
            setPaginaAtual((prev) => (prev < totalPaginas ? prev + 1 : prev))
          }
          disabled={paginaAtual === totalPaginas}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
      {isResizing && <div className="fixed inset-0 cursor-ew-resize z-50" />}
    </div>
  );
}
