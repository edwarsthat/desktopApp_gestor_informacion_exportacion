/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { lotesType } from "@renderer/types/lotesType";
import "@renderer/css/components.css"
import "@renderer/css/main.css"
import "@renderer/css/table.css"
import "./css/informesCalidad.css"

import TablaInformeCalidad from "./components/TablaInformeCalidad";
import ViewInformeData from "./components/ViewInformeData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";

export default function InformesProveedorContabilidad(): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<lotesType>({
    actionData: "get_contabilidad_informes_calidad",
    actionNumberData: "get_contabilidad_informes_calidad_numeroElementos",
    page: page
  });
  const { setCurrentFilters, currentFilters } = useFiltroValue();


  const [datosFiltrados, setDatosFiltrados] = useState<lotesType[]>([]);
  const [showTable, setShowTable] = useState<boolean>(true)
  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()


  useEffect(() => {
    obtenerCantidadElementos()
  }, [])
  useEffect(() => {
    obtenerData()
  }, [page])
    useEffect(() => {
    const datosFiltrados = data.filter(
      (item) =>
        item.enf && item.enf.toLowerCase().includes(currentFilters.buscar.toLowerCase()) ||
        item.predio && item.predio.PREDIO && item.predio.PREDIO.toLowerCase().includes(currentFilters.buscar.toLowerCase()) ||
        item.tipoFruta && item.tipoFruta.tipoFruta.toLowerCase().includes(currentFilters.buscar.toLowerCase())
    );

    setDatosFiltrados(datosFiltrados);
  }, [currentFilters, data]);

  const handleAccederDocumento = (lote): void => {
    setShowTable(false)
    setLoteSeleccionado(lote)
  };
  const handleVolverTabla = (): void => {
    setShowTable(true)
  }

  const modificarPrecios = (newPrecios): void => {
    const lote = JSON.parse(JSON.stringify(loteSeleccionado));
    lote.predio.precio = newPrecios
    setLoteSeleccionado(lote);

  }

  const captureComponent = async (): Promise<void> => {
    const element = document.getElementById('viewInformeDataContainer');
    if (element) {

      const FIXED_WIDTH = 1150;


      // Esperar a que todos los elementos estén completamente renderizados
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Opciones mejoradas para html2canvas
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff',
        onclone: (document) => {
          // Asegurarse de que las tablas tengan los estilos correctos
          const clonedElement = document.getElementById('viewInformeDataContainer');
          if (clonedElement) {
            clonedElement.style.width = `${FIXED_WIDTH}px`;

            // Copiar los estilos del elemento original
            const originalStyles = window.getComputedStyle(element);
            clonedElement.style.fontFamily = originalStyles.fontFamily;
            clonedElement.style.fontSize = originalStyles.fontSize;
            clonedElement.style.lineHeight = originalStyles.lineHeight;

            const tables = clonedElement.getElementsByTagName('table');
            for (const table of tables) {
              table.style.borderCollapse = 'collapse';
              table.style.backgroundColor = '#ffffff';

              const cells = table.getElementsByTagName('td');
              for (const cell of cells) {
                cell.style.verticalAlign = 'middle';
                cell.style.padding = '5px';
                cell.style.backgroundColor = '#ffffff';
              }
            }
          }
        },
        width: FIXED_WIDTH,
      });
      const dataURL = canvas.toDataURL('image/png');
      const alturaDoc = canvas.height

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [FIXED_WIDTH, alturaDoc]
      });
      pdf.addImage(dataURL, 'PNG', 0, 0, FIXED_WIDTH, alturaDoc); // Ajusta las dimensiones según sea necesario
      pdf.save(`${loteSeleccionado?.enf} ${loteSeleccionado?.predio.PREDIO} ${loteSeleccionado?.tipoFruta.tipoFruta} ${loteSeleccionado?.kilos} ${new Date(loteSeleccionado?.fechaIngreso ?
        loteSeleccionado?.fechaIngreso : 0
      ).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Bogota"
      })}.pdf`);
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


      {showTable ?
        <TablaInformeCalidad
          handleAccederDocumento={handleAccederDocumento}
          datosFiltrados={datosFiltrados} />
        :

        <ViewInformeData
          modificarPrecios={modificarPrecios}
          captureComponent={captureComponent}
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

