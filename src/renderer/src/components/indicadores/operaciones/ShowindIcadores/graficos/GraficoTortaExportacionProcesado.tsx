/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";
import { itemExportacionType } from "../validations/types"
import { Chart } from "chart.js";
import { buildExportacionChartConfig } from "../config/chartConfig";

type propsType = {
    data: itemExportacionType[]
    dataOriginal: itemExportacionType[]
    agrupacion: string
    filtrosTipoFruta: string[];
    filtrosCalidad: string[];
    filtrosCalibre: string[];
}


export default function GraficoTortaExportacionProcesado({
    data, agrupacion, filtrosTipoFruta, filtrosCalidad, filtrosCalibre, dataOriginal
}: propsType): JSX.Element {
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        const canvas = document.getElementById('myChart_indicadores_operativo_exportacion') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cleanup del chart anterior
        chartRef.current?.destroy();

        // Usa el generador de config
        const config = buildExportacionChartConfig( dataOriginal, data, filtrosTipoFruta, filtrosCalidad, filtrosCalibre);

        chartRef.current = new Chart(ctx, config);

        // Limpieza al desmontar
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [data, agrupacion]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de Exportacion</h2>
            <canvas id="myChart_indicadores_operativo_exportacion" width="700" height="350"></canvas>
        </div>
    )
}
