/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

import { Chart } from "chart.js";
import { buildEficienciaPrediosBarChartConfig } from "../config/chartConfig";
import { lotesType } from "@renderer/types/lotesType";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { tipoCalidad } from "@renderer/utils/tipoFrutas";


type propsType = {
    data: lotesType[];
    elemento: string
    titulo: string
}


export default function GraficoBarrasLotesDatos({
    data, elemento, titulo
}: propsType): JSX.Element {
    const chartRef = useRef<Chart | null>(null);
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta);
    const trueTitulo = tipoCalidad(titulo, tiposFruta);

    useEffect(() => {
        const canvas = document.getElementById(`myChart_indicadores_operativo_eficiencia_predios_historigrama_${elemento}`) as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cleanup del chart anterior
        chartRef.current?.destroy();

        // Usa el generador de config
        const config = buildEficienciaPrediosBarChartConfig(data, elemento, trueTitulo);
        chartRef.current = new Chart(ctx, config);

        // Limpieza al desmontar
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [data]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de Kilos {trueTitulo}</h2>
            <canvas id={`myChart_indicadores_operativo_eficiencia_predios_historigrama_${elemento}`} width="700" height="350"></canvas>
        </div>
    )
}
