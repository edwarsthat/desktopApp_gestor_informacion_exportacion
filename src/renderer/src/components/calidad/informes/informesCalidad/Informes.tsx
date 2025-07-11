/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { lotesType } from "@renderer/types/lotesType";
import useAppContext from "@renderer/hooks/useAppContext";
import "@renderer/css/components.css"
import "@renderer/css/main.css"
import "@renderer/css/table.css"
import "./css/informesCalidad.css"

import TablaInformeCalidad from "./components/TablaInformeCalidad";
import ViewInformeData from "./components/ViewInformeData";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro";

export default function Informes(): JSX.Element {
  const { messageModal } = useAppContext();
  const [page, setPage] = useState<number>(1);
  const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<lotesType>({
    actionData: "get_calidad_informes_lotesInformesProveedor",
    actionNumberData: "get_calidad_informes_informeProveedor_numeroElementos",
    page: page
  });
  const { setCurrentFilters, currentFilters } = useFiltroValue();


  const [datosFiltrados, setDatosFiltrados] = useState<lotesType[]>([]);
  const [showTable, setShowTable] = useState<boolean>(true)
  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()
  const [filtroAprobacionProduccion, setFiltroAprobacionProduccion] = useState<boolean>(false)
  const [filtroAprobacionComercial, setFiltroAprobacionComercial] = useState<boolean>(false)

  useEffect(() => {
    obtenerCantidadElementos()
  }, [])
  useEffect(() => {
    obtenerData()
  }, [page])

  useEffect(() => {
    let datosFiltrados = data.filter(
      (item) =>
        item.enf && item.enf.toLowerCase().includes(currentFilters.buscar.toLowerCase()) ||
        item.predio && item.predio.PREDIO && item.predio.PREDIO.toLowerCase().includes(currentFilters.buscar.toLowerCase()) ||
        item.tipoFruta && item.tipoFruta.toLowerCase().includes(currentFilters.buscar.toLowerCase())
    );
    if (filtroAprobacionProduccion) {
      datosFiltrados = datosFiltrados.filter(
        (item) =>
          !item.aprobacionProduccion
      );
    }
    if (filtroAprobacionComercial) {
      datosFiltrados = datosFiltrados.filter(
        (item) =>
          !item.aprobacionComercial
      );
    }

    setDatosFiltrados(datosFiltrados);
  }, [currentFilters, data, filtroAprobacionProduccion, filtroAprobacionComercial]);

  const handleAccederDocumento = (lote): void => {
    setShowTable(false)
    setLoteSeleccionado(lote)
  };
  const handleVolverTabla = (): void => {
    setShowTable(true)
  }

  const no_pagar_balin = async (newLote: lotesType): Promise<void> => {
    setLoteSeleccionado(newLote);
    try {
      const query = {
        action: "put_calidad_informe_noPagarBalinLote",
        _id: newLote._id,
      }
      const response = await window.api.server2(query)
      if (response.status !== 200)
        throw new Error(`Code ${response.status} : ${response.message}`)
      await obtenerData();
      messageModal("success", "Datos guardados con exito")
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", "Error creando caso Favorita")
      }
    }
  }

  return (
    <div className="componentContainer">
      <div className="navBar"></div>
      <h2>Informe proveedor</h2>
      <hr />


      <Filtros
        showBuscar={true}
        ggnId="informescalidadProveedor"
        onFiltersChange={setCurrentFilters}
      />

      <div className="select-indicador-container">
        <input type="checkbox" id="filtro-aprobacion-produccion" name="select-indicador" onChange={(e): void => setFiltroAprobacionProduccion(e.target.checked)} />
        <label htmlFor="filtro-aprobacion-produccion">Sin Aprobación Producción</label>

        <input type="checkbox" id="filtro-aprobacion-comercial" name="select-indicador" onChange={(e): void => setFiltroAprobacionComercial(e.target.checked)} />
        <label htmlFor="filtro-aprobacion-comercial">Sin Aprobación Comercial</label>
      </div>

      {showTable ?
        <TablaInformeCalidad
          handleAccederDocumento={handleAccederDocumento}
          datosFiltrados={datosFiltrados} />
        :

        <ViewInformeData
          no_pagar_balin={no_pagar_balin}
          obtenerDatosDelServidor={obtenerData}
          handleVolverTabla={handleVolverTabla}
          loteSeleccionado={loteSeleccionado}
        />

      }
      {showTable &&
        <BotonesPasarPaginas
          division={50}
          page={page}
          numeroElementos={numeroElementos}
          setPage={setPage}
        />
      }
    </div>
  );
};

