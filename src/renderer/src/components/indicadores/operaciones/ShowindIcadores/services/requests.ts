/* eslint-disable prettier/prettier */

import { FilterValues } from "@renderer/hooks/useFiltro";
import { agruparRegistrosKilosExportacion, agruparRegistrosKilospRocesados, obtener_filtros_exportaciones } from "../function";
import { validateFrutapRocesadaHora } from "../validations/requestValidations";

export const datosProceso = async (
    setData, setDataOriginal, setDataExportacion, setDataExportacionOriginal, setFiltrosExportacion, currentFilters
): Promise<void> => {
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
    setDataExportacion(dataExportacionAgrupada)
    setDataExportacionOriginal(dataExportacionAgrupada)

    const dataFiltro = obtener_filtros_exportaciones(response.data)
    setFiltrosExportacion(dataFiltro)
}

export const datosPredios = async (currentFilters:FilterValues, setLotes, setTotalesLotes): Promise<void> => {
    if( currentFilters.proveedor === "") throw new Error("El proveedor es requerido para el indicador de rendimiento por predios");
    console.log("Datos de rendimiento por predios:", currentFilters.proveedor);

    const request = {
        action: "get_indicadores_operaciones_rendimientoPredios",
        filtro: currentFilters
    }
        const response = await window.api.server2(request);
    if (response.status !== 200) {
        throw new Error(`Code ${response.status}: ${response.message}`);
    }
    console.log("Datos de rendimiento por predios:", response.data);
    setLotes(response.data.lotes);
    setTotalesLotes({ 
        totalKilosIngreso: response.data.totalKilosIngreso, 
        totalKilosProcesados: response.data.totalKilosProcesados,
        totalKilosExportacion: response.data.totalKilosExportacion,
        totalKilosDescarte: response.data.totalKilosDescarte
    });
}