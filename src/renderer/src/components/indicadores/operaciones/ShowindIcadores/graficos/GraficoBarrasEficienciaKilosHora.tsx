/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import { IndicadorKilosProcesados } from "../validations/types";
import { buildEficienciaKilosHoraChartConfig } from "../config/chartConfig";

type propsType = {
    data: IndicadorKilosProcesados[]
    agrupacion: string
}

export default function GraficoBarrasEficienciaKilosHora(props: propsType): JSX.Element {
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        const canvas = document.getElementById('myChart_indicadores_operativo_eficiencia_kilos_hora') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cleanup del chart anterior
        chartRef.current?.destroy();

        // Usa el generador de config
        const config = buildEficienciaKilosHoraChartConfig(props.data, props.agrupacion);

        chartRef.current = new Chart(ctx, config);

        // Limpieza al desmontar
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [props.data, props.agrupacion]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de Eficiencia de Procesado (%)</h2>
            <canvas id="myChart_indicadores_operativo_eficiencia_kilos_hora" width="700" height="350"></canvas>
        </div>
    )
}
