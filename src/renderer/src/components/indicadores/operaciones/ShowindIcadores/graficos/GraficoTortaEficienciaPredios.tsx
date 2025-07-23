/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

import { Chart } from "chart.js";
import { totalesLotesType } from "../validations/types";
import { buildEficienciaPrediosPieChartConfig } from "../config/chartConfig";


type propsType = {
    totalLotes: totalesLotesType;
    filtrosCalidad: string[];

}


export default function GraficoTortaEficienciaPredios({
    totalLotes, filtrosCalidad
}: propsType): JSX.Element {
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        const canvas = document.getElementById('myChart_indicadores_operativo_eficiencia_predios') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cleanup del chart anterior
        chartRef.current?.destroy();

        // Usa el generador de config
        const config = buildEficienciaPrediosPieChartConfig(totalLotes, filtrosCalidad);

        chartRef.current = new Chart(ctx, config);

        // Limpieza al desmontar
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [totalLotes]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de Eficiencia por Predio</h2>
            <canvas id="myChart_indicadores_operativo_eficiencia_predios" width="700" height="350"></canvas>
        </div>
    )
}
