/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react";
import TablaHistorialIngresoFruta from "./components/TablaHistorialIngresoFruta";
import useAppContext from "@renderer/hooks/useAppContext";
import ModalModificarLote from "./components/ModalModificarLote";
import { recordLotesType } from "@renderer/types/recorLotesType";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";


export default function HistorialIngresoFruta(): JSX.Element {
  const { eventoServidor, triggerServer } = useAppContext();
  const [page, setPage] = useState<number>(1);
  const [loteSeleccionado, setLoteSeleccionado] = useState<recordLotesType>()
  const {
    obtenerData,
    obtenerCantidadElementos,
    data,
    numeroElementos
  } = useFetchPaginatedList<recordLotesType>({
    page,
    actionData: "get_inventarios_historiales_ingresoFruta_registros",
    actionNumberData: "get_inventarios_historiales_ingresoFruta_numeroElementos"
  })


  useEffect(() => {
    if (eventoServidor === 'add_lote') {
      obtenerData()
    }
  }, [triggerServer])


  useEffect(() => {
    obtenerData()
    console.log(data)
  }, [page])

  useEffect(() => {
    obtenerCantidadElementos()
  }, [])

  const handleModificar = (): void => {
    const dialogINfo = document.getElementById("inventarios_ingresoFruta_modificar_historial_dialog") as HTMLDialogElement;
    if (dialogINfo) {
      dialogINfo.showModal();
    }
  }
  return (
    <div>
      <div className="navBar"></div>
      <h2>Historial ingreso fruta</h2>
      <TablaHistorialIngresoFruta
        setLoteSeleccionado={setLoteSeleccionado}
        data={data}
        handleModificar={handleModificar} />
      <BotonesPasarPaginas
        numeroElementos={numeroElementos}
        page={page}
        setPage={setPage}
        division={50} />


      <ModalModificarLote
        obtenerData={obtenerData}
        loteSeleccionado={loteSeleccionado}
        handleModificar={handleModificar} />
    </div>
  );
};



