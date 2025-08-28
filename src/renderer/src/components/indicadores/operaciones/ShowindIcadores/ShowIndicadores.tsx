/* eslint-disable prettier/prettier */

import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro"
import { useEffect, useRef, useState } from "react";
import EficienciaOperativaComponent from "./components/EficienciaOperativaComponent";
import useAppContext from "@renderer/hooks/useAppContext";
import { z } from "zod";
import { agruparRegistrosKilosExportacion, agruparRegistrosKilospRocesados, arreglar_datos_excel_eficiencia, arreglar_datos_excel_eficienciaPredios, arreglar_datos_excel_exportaciones, arreglar_datos_excel_kilos_hora } from "./function";
import { filtrosExportacionesType, IndicadorKilosProcesados, filtroExportacionesSelectType, itemExportacionType, totalesLotesType } from "./validations/types";
import './styles.css';
import { indicadoresType } from "@renderer/types/indicadoresType";
import EficienciaKilosHora from "./components/EficienciaKilosHora";
import FiltrosExportaciones from "./components/FiltrosExportaciones";
import ExportacionDiaria from "./components/ExportacionDiaria";
import { datosPredios, datosProceso } from "./services/requests";
import { lotesType } from "@renderer/types/lotesType";
import EficienciaPredios from "./components/EficienciaPredios";
import FiltroRendimientoPredios from "./components/FiltroRendimientoPredios";



export default function ShowIndicadores(): JSX.Element {
    const { setLoading, messageModal } = useAppContext();
    const { setCurrentFilters, currentFilters } = useFiltroValue();

    // kilos procesados
    const [data, setData] = useState<IndicadorKilosProcesados[]>([]);
    const [dataOriginal, setDataOriginal] = useState<indicadoresType[]>([]);
    const [tipoIndicador, setTipoIndicador] = useState<string>('');

    //exportacion
    const [dataExportacion, setDataExportacion] = useState<itemExportacionType[]>([]);
    const [dataExportacionOriginal, setDataExportacionOriginal] = useState<itemExportacionType[]>([]);
    const [lotes, setLotes] = useState<lotesType[]>([]);
    const [totalesLotes, setTotalesLotes] = useState<totalesLotesType>({
        totalKilosIngreso: 0, totalKilosProcesados: 0, totalKilosExportacion: 0, totalKilosDescarte: 0,
        calidades:{}, calibresTotal: {}
    });

    const [filtrosTipoFruta, setFiltrosTipoFruta] = useState<string[]>([]);
    const [filtrosCalidad, setFiltrosCalidad] = useState<string[]>([]);
    const [filtrosCalibre, setFiltrosCalibre] = useState<string[]>([]);

    const [selectFiltroExportacion, setSelectFiltroExportacion] = useState<filtroExportacionesSelectType>({
        tipoFruta: false,
        calidad: false,
        calibre: false
    });
    const [filtrosExportacion, setFiltrosExportacion] = useState<filtrosExportacionesType>({
        tipoFruta: [],
        calidad: [],
        calibre: []
    })

    const dataRef = useRef(data);
    const exportRef = useRef(dataExportacion);
    const tipoIndicadorRef = useRef(tipoIndicador);
    const filtrosTipoFrutaRef = useRef(filtrosTipoFruta);
    const totalesLotesRef = useRef(totalesLotes);
    const selectFiltroExportacionRef = useRef(selectFiltroExportacion);
    const filtrosCalibreRef = useRef(filtrosCalibre);



    useEffect(() => {

        if (tipoIndicador !== '' && currentFilters.fechaInicio !== '') {
            if (tipoIndicador === 'rendimiento-predios' && currentFilters.proveedor !== '') {
                buscar();
            } else {
                buscar();
            }

        }
        dataRef.current = data;
        tipoIndicadorRef.current = tipoIndicador;
        exportRef.current = dataExportacion;
        filtrosTipoFrutaRef.current = filtrosTipoFruta;
        totalesLotesRef.current = totalesLotes;
        selectFiltroExportacionRef.current = selectFiltroExportacion;
        filtrosCalibreRef.current = filtrosCalibre;

    }, [selectFiltroExportacion, filtrosTipoFruta, filtrosCalidad, filtrosCalibre, currentFilters, tipoIndicador]);

    useEffect(() => {

        window.api.solicitarDatosTabla(() => {
            let dataExcel
            switch (tipoIndicadorRef.current) {
                case 'kilo-hora':
                    dataExcel = arreglar_datos_excel_kilos_hora(dataRef.current)
                    break;
                case 'eficiencia-kilos-hora':
                    dataExcel = arreglar_datos_excel_eficiencia(dataRef.current)
                    break;
                case 'exportacion-dia':
                    dataExcel = arreglar_datos_excel_exportaciones(exportRef.current, filtrosTipoFrutaRef.current);
                    break;
                case 'rendimiento-predios':
                    dataExcel = arreglar_datos_excel_eficienciaPredios(totalesLotesRef.current, selectFiltroExportacionRef.current, filtrosCalibreRef.current);
                    console.log("dataExcel", dataExcel)
                    break;
            }
            console.log("Datos a enviar para Excel:", dataExcel);
            window.api.enviarDatosTabla(dataExcel);
        });
    }, []);



    const buscar = async (): Promise<void> => {
        try {
            setLoading(true);

            if (tipoIndicador === 'rendimiento-predios') {
                await datosPredios(currentFilters, setLotes, setTotalesLotes, filtrosCalidad, setFiltrosExportacion)
            } else {
                await datosProceso(setData, setDataOriginal, setDataExportacion, setDataExportacionOriginal, setFiltrosExportacion, currentFilters)
            }
        } catch (err) {
            // Manejar errores de validación de Zod
            if (err instanceof z.ZodError) {
                const errorMessages = err.errors.map(error => {
                    const field = error.path.length > 0 ? error.path.join('.') : 'campo';
                    return `${field}: ${error.message}`;
                }).join('\n');

                messageModal("error", `Errores de validación:\n${errorMessages}`);
            } else if (err instanceof Error) {
                messageModal("error", `Error al buscar los registros: ${err.message}`);
            } else {
                messageModal("error", "Error desconocido al buscar los registros");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        const dataFiltrada = agruparRegistrosKilospRocesados(dataOriginal, currentFilters.divisionTiempo);
        setData(dataFiltrada);

        const exportacionFiltrada = agruparRegistrosKilosExportacion(dataOriginal, currentFilters.divisionTiempo);
        setDataExportacion(exportacionFiltrada);
    }, [currentFilters]);

    // useEffect(() => {
    //     let datosFiltrados = structuredClone(dataExportacionOriginal);

    //     if (filtrosTipoFruta.length > 0) {
    //         datosFiltrados = filtrar_tipoFruta(datosFiltrados, filtrosTipoFruta)
    //     }
    //     if (filtrosCalidad.length > 0) {
    //         datosFiltrados = filtrar_calidad(datosFiltrados, filtrosCalidad)
    //     }
    //     if (filtrosCalibre.length > 0) {
    //         datosFiltrados = filtrar_calibre(datosFiltrados, filtrosCalibre)
    //     }
    //     console.log("Datos filtrados:", datosFiltrados);
    //     setDataExportacion(datosFiltrados);

    // }, [filtrosTipoFruta, filtrosCalidad, filtrosCalibre])

    return (
        <div >
            <div >
                <div className="navBar"></div>
                {tipoIndicador === '' && <h2>Indicadores Operativos</h2>}
                {tipoIndicador === 'kilo-hora' && <h2>Kilogramos por Hora vs Meta</h2>}
                {tipoIndicador === 'eficiencia-kilos-hora' && <h2>Eficiencia Kilogramos por Hora</h2>}
                {tipoIndicador === 'exportacion-dia' && <h2>Total Exportacion Diaria</h2>}

                <hr />

                {/* Select adicional */}
                <div className="select-indicador-container">
                    <label htmlFor="select-indicador">Tipo de Indicador:</label>
                    <select id="select-indicador" className="select-indicador" onChange={(e): void => setTipoIndicador(e.target.value)} value={tipoIndicador}>
                        <option value="">Seleccionar Tipo de Indicador</option>
                        <option value="kilo-hora">Kilogramos por Hora vs Meta</option>
                        <option value="eficiencia-kilos-hora">Eficiencia Operativa</option>
                        <option value="exportacion-dia">Total Exportacion Diaria</option>
                        <option value="rendimiento-predios">Rendimiento por Predios</option>
                    </select>
                </div>

                <Filtros
                    showDivisionTiempo={(tipoIndicador !== "rendimiento-predios")}
                    showFechaInicio={true}
                    showFechaFin={true}
                    showProveedor={(tipoIndicador === "rendimiento-predios")}
                    showTipoFruta2={(tipoIndicador === "rendimiento-predios")}
                    ggnId="indicadoresGGN"
                    onFiltersChange={setCurrentFilters}
                />

                {tipoIndicador === "exportacion-dia" && (
                    <FiltrosExportaciones
                        filtrosTipoFruta={filtrosTipoFruta}
                        setFiltrosTipoFruta={setFiltrosTipoFruta}
                        filtrosCalidad={filtrosCalidad}
                        setFiltrosCalidad={setFiltrosCalidad}
                        filtrosCalibre={filtrosCalibre}
                        setFiltrosCalibre={setFiltrosCalibre}
                        filtrosExportacion={filtrosExportacion}
                        selectFiltroExportacion={selectFiltroExportacion}
                        setSelectFiltroExportacion={setSelectFiltroExportacion}
                    />
                )}

                {tipoIndicador === "rendimiento-predios" &&
                    <FiltroRendimientoPredios
                        filtrosCalidad={filtrosCalidad}
                        setFiltrosCalidad={setFiltrosCalidad}
                        filtrosCalibre={filtrosCalibre}
                        setFiltrosCalibre={setFiltrosCalibre}
                        filtrosExportacion={filtrosExportacion}
                        selectFiltroExportacion={selectFiltroExportacion}
                        setSelectFiltroExportacion={setSelectFiltroExportacion}
                    />}
            </div>


            <div className="show-indicadores-content">
                {tipoIndicador === 'kilo-hora' && <EficienciaOperativaComponent currentFilters={currentFilters} data={data} />}
                {tipoIndicador === 'eficiencia-kilos-hora' && <EficienciaKilosHora currentFilters={currentFilters} data={data} />}
                {tipoIndicador === 'exportacion-dia' &&
                    <ExportacionDiaria
                        dataOriginal={dataExportacionOriginal}
                        data={dataExportacion}
                        currentFilters={currentFilters}
                        filtrosTipoFruta={filtrosTipoFruta}
                        filtrosCalidad={filtrosCalidad}
                        filtrosCalibre={filtrosCalibre}
                    />
                }
                {tipoIndicador === 'rendimiento-predios' &&
                    <EficienciaPredios
                        filtrosCalibre={filtrosCalibre}
                        selectFiltroExportacion={selectFiltroExportacion}
                        data={lotes}
                        totalLotes={totalesLotes}
                        filtrosCalidad={filtrosCalidad} />}
            </div>
        </div>
    )
}
