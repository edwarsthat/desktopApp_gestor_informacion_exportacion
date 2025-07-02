/* eslint-disable prettier/prettier */

import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro"
import { useEffect, useRef, useState } from "react";
import EficienciaOperativaComponent from "./components/EficienciaOperativaComponent";
import useAppContext from "@renderer/hooks/useAppContext";
import { validateFrutapRocesadaHora } from "./validations/requestValidations";
import { z } from "zod";
import { agruparRegistrosKilosExportacion, agruparRegistrosKilospRocesados, arreglar_datos_excel_eficiencia, arreglar_datos_excel_kilos_hora, obtener_filtros_exportaciones } from "./function";
import { filtrosExportacionesType, IndicadorKilosProcesados, filtroExportacionesSelectType, itemExportacionType } from "./validations/types";
import './styles.css';
import { indicadoresType } from "@renderer/types/indicadoresType";
import EficienciaKilosHora from "./components/EficienciaKilosHora";
import FiltrosExportaciones from "./components/FiltrosExportaciones";
import ExportacionDiaria from "./components/ExportacionDiaria";



export default function ShowIndicadores(): JSX.Element {
    const { setLoading, messageModal } = useAppContext();
    const { setCurrentFilters, currentFilters } = useFiltroValue();

    // kilos procesados
    const [data, setData] = useState<IndicadorKilosProcesados[]>([]);
    const [dataOriginal, setDataOriginal] = useState<indicadoresType[]>([]);
    const [tipoIndicador, setTipoIndicador] = useState<string>('');

    const [dataExportacion, setDataExportacion] = useState<itemExportacionType[]>([]);

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
    const tipoIndicadorRef = useRef(tipoIndicador);

    useEffect(() => {
        dataRef.current = data;
        tipoIndicadorRef.current = tipoIndicador;
    }, [data, tipoIndicador]);

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

            }
            window.api.enviarDatosTabla(dataExcel);
        });
    }, []);



    const buscar = async (): Promise<void> => {
        try {
            setLoading(true);
            validateFrutapRocesadaHora.parse(currentFilters);

            const request = {
                action: "get_indicadores_operaciones_kilosProcesados",
                filtro: currentFilters
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }

            const dataFiltrada = agruparRegistrosKilospRocesados(response.data, currentFilters.divisionTiempo);
            setData(dataFiltrada);
            setDataOriginal(response.data);

            const dataExportacionAgrupada = agruparRegistrosKilosExportacion(response.data, currentFilters.divisionTiempo);
            console.log(dataExportacionAgrupada)
            setDataExportacion(dataExportacionAgrupada)

            const dataFiltro = obtener_filtros_exportaciones(response.data)
            setFiltrosExportacion(dataFiltro)
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
    }, [currentFilters]);

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
                    </select>
                </div>

                <Filtros
                    showDivisionTiempo={true}
                    showFechaInicio={true}
                    showFechaFin={true}
                    showButton={true}
                    findFunction={buscar}
                    ggnId="indicadoresGGN"
                    onFiltersChange={setCurrentFilters}
                />

                {tipoIndicador === "exportacion-dia" && (
                    <FiltrosExportaciones
                        filtrosExportacion={filtrosExportacion}
                        selectFiltroExportacion={selectFiltroExportacion}
                        setSelectFiltroExportacion={setSelectFiltroExportacion}
                    />
                )}
            </div>


            <div className="show-indicadores-content">
                {tipoIndicador === 'kilo-hora' && <EficienciaOperativaComponent currentFilters={currentFilters} data={data} />}
                {tipoIndicador === 'eficiencia-kilos-hora' && <EficienciaKilosHora currentFilters={currentFilters} data={data} />}
                {tipoIndicador === 'exportacion-dia' && <ExportacionDiaria data={dataExportacion}/>}
            </div>
        </div>
    )
}
