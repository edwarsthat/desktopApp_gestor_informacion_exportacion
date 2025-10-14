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

  const exportInformePDF = async (): Promise<void> => {
    const element = document.getElementById('viewInformeDataContainer');
    if (!element) return;

    try {
      // Esperar a que todo se renderice completamente
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Configuraciones para la captura
      const SCALE = 2; // Alta resolución
      const QUALITY = 0.95;
      const FIXED_WIDTH = 1150; // Ancho fijo para consistencia

      // Capturar el elemento con html2canvas
      const canvas = await html2canvas(element, {
        scale: SCALE,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        logging: false,
        width: FIXED_WIDTH, // Forzar ancho fijo
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('viewInformeDataContainer');
          if (clonedElement) {
            // Forzar ancho fijo en el elemento clonado
            clonedElement.style.width = `${FIXED_WIDTH}px`;
            clonedElement.style.maxWidth = `${FIXED_WIDTH}px`;
            clonedElement.style.minWidth = `${FIXED_WIDTH}px`;
            
            // Asegurar fondo blanco
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.padding = '20px';
            clonedElement.style.fontFamily = 'Arial, sans-serif';
            
            // Aplicar estilos específicos de .table-main-informe-proveedor
            const tables = clonedElement.querySelectorAll('table');
            tables.forEach((table) => {
              // Estilos base de la tabla
              table.style.backgroundColor = 'white';
              table.style.width = '100%';
              table.style.marginTop = '15px';
              table.style.color = 'black';
              table.style.borderRadius = '8px';
              table.style.overflow = 'hidden';
              table.style.boxShadow = 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset';
              table.style.borderCollapse = 'separate';
              table.style.borderSpacing = '0';
              
              // Estilos para thead
              const thead = table.querySelector('thead');
              if (thead) {
                thead.style.backgroundColor = 'var(--color-Celifrut)';
                thead.style.backgroundColor = '#4CAF50'; // Color verde Celifrut como fallback
                thead.style.borderCollapse = 'collapse';
                
                const headerRows = thead.querySelectorAll('tr');
                headerRows.forEach((row) => {
                  (row as HTMLElement).style.height = '45px';
                  (row as HTMLElement).style.fontSize = '12px';
                  (row as HTMLElement).style.minHeight = '100px';
                  (row as HTMLElement).style.paddingLeft = '5px';
                  (row as HTMLElement).style.maxWidth = '350px';
                  (row as HTMLElement).style.overflow = 'hidden';
                  (row as HTMLElement).style.color = 'white';
                  (row as HTMLElement).style.fontWeight = 'bold';
                });
              }
              
              // Estilos para tbody
              const tbody = table.querySelector('tbody');
              if (tbody) {
                const bodyRows = tbody.querySelectorAll('tr');
                bodyRows.forEach((row, index) => {
                  // Alternar colores de fondo (fondo-par y fondo-impar)
                  if (index % 2 === 0) {
                    (row as HTMLElement).style.backgroundColor = 'rgb(251, 251, 251)'; // fondo-par
                  } else {
                    (row as HTMLElement).style.backgroundColor = 'rgb(222, 223, 224)'; // fondo-impar
                  }
                  
                  // Estilos para las celdas
                  const cells = row.querySelectorAll('td');
                  cells.forEach((cell) => {
                    (cell as HTMLElement).style.fontSize = '14px';
                    (cell as HTMLElement).style.textAlign = 'center';
                    (cell as HTMLElement).style.minHeight = '100px';
                    (cell as HTMLElement).style.paddingLeft = '5px';
                    (cell as HTMLElement).style.paddingRight = '5px';
                    (cell as HTMLElement).style.paddingTop = '8px';
                    (cell as HTMLElement).style.paddingBottom = '8px';
                    (cell as HTMLElement).style.maxWidth = '350px';
                    (cell as HTMLElement).style.overflow = 'hidden';
                    (cell as HTMLElement).style.color = 'black';
                    (cell as HTMLElement).style.border = 'none';
                  });
                });
              }
              
              // Estilos para celdas th (encabezados)
              const headers = table.querySelectorAll('th');
              headers.forEach((header) => {
                (header as HTMLElement).style.fontSize = '12px';
                (header as HTMLElement).style.textAlign = 'center';
                (header as HTMLElement).style.padding = '8px 5px';
                (header as HTMLElement).style.color = 'white';
                (header as HTMLElement).style.fontWeight = 'bold';
                (header as HTMLElement).style.border = 'none';
                (header as HTMLElement).style.textTransform = 'uppercase';
              });
            });

            // Mejorar títulos
            const headings = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach((heading) => {
              (heading as HTMLElement).style.color = '#000000';
              (heading as HTMLElement).style.fontWeight = 'bold';
              (heading as HTMLElement).style.marginBottom = '15px';
              (heading as HTMLElement).style.textAlign = 'center';
            });

            // Mejorar texto general
            const allText = clonedElement.querySelectorAll('p, div, span');
            allText.forEach((text) => {
              (text as HTMLElement).style.color = '#000000';
            });

            // Aplicar estilos específicos para elementos con clases de totales
            const totalRows = clonedElement.querySelectorAll('.informe-calidad-total-fila');
            totalRows.forEach((row) => {
              (row as HTMLElement).style.backgroundColor = '#C8C8C8';
              (row as HTMLElement).style.fontWeight = 'bold';
            });

            // Aplicar estilos para las observaciones con diseño de tabla
            const observacionesContainers = clonedElement.querySelectorAll('.observaciones-calidad-interna, .observaciones-observaciones');
            observacionesContainers.forEach((container) => {
              (container as HTMLElement).style.backgroundColor = 'white';
              (container as HTMLElement).style.borderRadius = '8px';
              (container as HTMLElement).style.overflow = 'hidden';
              (container as HTMLElement).style.boxShadow = 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset';
              (container as HTMLElement).style.marginBottom = '20px';
            });

            // Aplicar estilos específicos para la tabla de calidad interna
            const tablaCalidadInterna = clonedElement.querySelectorAll('.tabla-calidad-interna');
            tablaCalidadInterna.forEach((tabla) => {
              (tabla as HTMLElement).style.width = '100%';
              (tabla as HTMLElement).style.borderCollapse = 'separate';
              (tabla as HTMLElement).style.borderSpacing = '0';
              (tabla as HTMLElement).style.backgroundColor = 'white';
              
              // Estilos para thead
              const thead = tabla.querySelector('thead');
              if (thead) {
                const headerRows = thead.querySelectorAll('tr');
                headerRows.forEach((row) => {
                  (row as HTMLElement).style.backgroundColor = 'rgb(251, 251, 251)';
                });
              }
              
              // Estilos para tbody
              const tbody = tabla.querySelector('tbody');
              if (tbody) {
                const bodyRows = tbody.querySelectorAll('tr');
                bodyRows.forEach((row) => {
                  (row as HTMLElement).style.backgroundColor = 'rgb(222, 223, 224)';
                });
              }
              
              // Estilos para th y td
              const cells = tabla.querySelectorAll('th, td');
              cells.forEach((cell) => {
                (cell as HTMLElement).style.padding = '10px 15px';
                (cell as HTMLElement).style.textAlign = 'center';
                (cell as HTMLElement).style.fontSize = '14px';
                (cell as HTMLElement).style.color = 'black';
                (cell as HTMLElement).style.border = 'none';
                (cell as HTMLElement).style.minHeight = '40px';
                
                // Asegurar que todo el texto dentro de la celda sea negro
                const textNodes = cell.querySelectorAll('*');
                textNodes.forEach((node) => {
                  (node as HTMLElement).style.color = 'black';
                });
              });
              
              // Estilos específicos para th
              const headers = tabla.querySelectorAll('th');
              headers.forEach((header) => {
                (header as HTMLElement).style.fontWeight = 'bold';
                (header as HTMLElement).style.textTransform = 'capitalize';
                (header as HTMLElement).style.color = 'black';
              });
              
              // Estilos específicos para td
              const dataCells = tabla.querySelectorAll('td');
              dataCells.forEach((cell) => {
                (cell as HTMLElement).style.fontWeight = 'normal';
                (cell as HTMLElement).style.color = 'black';
              });
            });

            const observacionesHeaders = clonedElement.querySelectorAll('.observaciones-header');
            observacionesHeaders.forEach((header) => {
              (header as HTMLElement).style.backgroundColor = '#4CAF50';
              (header as HTMLElement).style.color = 'white';
              (header as HTMLElement).style.padding = '12px 15px';
              (header as HTMLElement).style.fontWeight = 'bold';
              (header as HTMLElement).style.textAlign = 'center';
              (header as HTMLElement).style.fontSize = '14px';
              (header as HTMLElement).style.textTransform = 'uppercase';
              
              const h4 = header.querySelector('h4');
              if (h4) {
                (h4 as HTMLElement).style.margin = '0';
                (h4 as HTMLElement).style.fontSize = '14px';
                (h4 as HTMLElement).style.fontWeight = 'bold';
                (h4 as HTMLElement).style.color = 'white';
              }
            });

            const observacionesItems = clonedElement.querySelectorAll('.observaciones-item');
            observacionesItems.forEach((item) => {
              (item as HTMLElement).style.display = 'flex';
              (item as HTMLElement).style.justifyContent = 'space-between';
              (item as HTMLElement).style.alignItems = 'center';
              (item as HTMLElement).style.padding = '10px 15px';
              (item as HTMLElement).style.fontSize = '14px';
              (item as HTMLElement).style.color = 'black';
              (item as HTMLElement).style.minHeight = '40px';
              
              // Aplicar colores alternos
              if (item.classList.contains('fondo-par')) {
                (item as HTMLElement).style.backgroundColor = 'rgb(251, 251, 251)';
              } else if (item.classList.contains('fondo-impar')) {
                (item as HTMLElement).style.backgroundColor = 'rgb(222, 223, 224)';
              }
            });

            const observacionesLabels = clonedElement.querySelectorAll('.observaciones-label');
            observacionesLabels.forEach((label) => {
              (label as HTMLElement).style.fontWeight = 'bold';
              (label as HTMLElement).style.color = 'black';
              (label as HTMLElement).style.textAlign = 'left';
            });

            const observacionesValues = clonedElement.querySelectorAll('.observaciones-value');
            observacionesValues.forEach((value) => {
              (value as HTMLElement).style.color = 'black';
              (value as HTMLElement).style.textAlign = 'right';
              (value as HTMLElement).style.fontWeight = 'normal';
            });

            const observacionesTexts = clonedElement.querySelectorAll('.observaciones-text');
            observacionesTexts.forEach((text) => {
              (text as HTMLElement).style.color = 'black';
              (text as HTMLElement).style.textAlign = 'left';
              (text as HTMLElement).style.width = '100%';
              (text as HTMLElement).style.fontWeight = 'normal';
              (text as HTMLElement).style.lineHeight = '1.4';
            });
          }
        }
      });

      // Crear el PDF con dimensiones fijas basadas en el ancho fijo
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Usar el ancho fijo para calcular dimensiones del PDF
      const pdfWidth = 210; // A4 width in mm (fijo)
      const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, Math.max(pdfHeight, 297)] // Mínimo A4 estándar
      });

      // Convertir canvas a imagen y agregarla al PDF con dimensiones fijas
      const imgData = canvas.toDataURL('image/jpeg', QUALITY);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Generar nombre del archivo
      const fecha = loteSeleccionado?.fechaIngreso ? 
        new Date(loteSeleccionado.fechaIngreso).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: "2-digit",
          day: "2-digit",
          timeZone: "America/Bogota"
        }) : new Date().toLocaleDateString('es-CO');

      const nombreArchivo = `Informe_${loteSeleccionado?.enf || 'SinENF'}_${loteSeleccionado?.predio?.PREDIO || 'SinPredio'}_${fecha.replace(/\//g, '-')}.pdf`;
      
      // Guardar el PDF
      pdf.save(nombreArchivo);

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    }
  };
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
          captureComponent={exportInformePDF}
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

