/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

import { Chart } from "chart.js";
import { dataLotesType, filtroExportacionesSelectType, totalesLotesType } from "../validations/types";
import { buildEficienciaPrediosPieChartConfig } from "../config/chartConfig";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";


type propsType = {
    totalLotes: totalesLotesType;
    dataCalibres: dataLotesType[];
    dataCalidades: dataLotesType[];
    filtrosCalidad: string[];
    filtrosCalibre: string[];
    selectFiltroExportacion: filtroExportacionesSelectType
}


export default function GraficoTortaEficienciaPredios({
    totalLotes, filtrosCalidad, filtrosCalibre, selectFiltroExportacion, dataCalibres, dataCalidades
}: propsType): JSX.Element {
    const chartRef = useRef<Chart | null>(null);
    const tiposFrutas = useTipoFrutaStore(state => state.tiposFruta);

    useEffect(() => {
        const canvas = document.getElementById('myChart_indicadores_operativo_eficiencia_predios') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cleanup del chart anterior
        chartRef.current?.destroy();
        // Usa el generador de config
        const config = buildEficienciaPrediosPieChartConfig(totalLotes, dataCalibres, dataCalidades, filtrosCalidad, filtrosCalibre, selectFiltroExportacion, tiposFrutas);

        chartRef.current = new Chart(ctx, config);

        // Limpieza al desmontar
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [totalLotes, filtrosCalidad, filtrosCalibre, selectFiltroExportacion]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de Eficiencia por Predio</h2>
            <canvas id="myChart_indicadores_operativo_eficiencia_predios" width="700" height="350"></canvas>
        </div>
    )
}
