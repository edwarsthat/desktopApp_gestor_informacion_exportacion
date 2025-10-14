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

export const datosPredios = async (currentFilters: FilterValues, setLotes, setDataCalibres, setDataCalidades, setTotalesLotes, filtrosCalidad: string[], setFiltrosExportacion): Promise<void> => {
    if (currentFilters.proveedor === "") throw new Error("El proveedor es requerido para el indicador de rendimiento por predios");

    const request = {
        action: "get_indicadores_operaciones_rendimientoPredios",
        filtro: { ...currentFilters, calidad: filtrosCalidad }
    }
    const response = await window.api.server2(request);
    if (response.status !== 200) {
        throw new Error(`Code ${response.status}: ${response.message}`);
    }
    const calidades = (response.data.dataLotesCalidades || []).map(item => item._id);
    const calibres = (response.data.dataLotesCalibres || []).map(item => item._id);
    console.log("response.data:", response.data);
    setDataCalibres(response.data.dataLotesCalibres || []);
    setDataCalidades(response.data.dataLotesCalidades || []);
    setLotes(response.data.lotes || []);
    setFiltrosExportacion((prev) => ({ ...prev, calibre: calibres, calidad: calidades }));
    setTotalesLotes({
        totalKilosIngreso: response.data.totalKilosIngreso,
        totalKilosProcesados: response.data.totalKilosProcesados,
        totalKilosExportacion: response.data.totalKilosExportacion,
        totalKilosDescarte: response.data.totalKilosDescarte,
        calibresTotal: calibres,
        calidades: calidades,
    });
}