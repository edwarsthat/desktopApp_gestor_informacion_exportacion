/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

import { Chart } from "chart.js";
import { buildEficienciaPrediosBarChartConfig } from "../config/chartConfig";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { tipoCalidad } from "@renderer/utils/tipoFrutas";
import { lotesType } from "@renderer/types/lotesType";


type propsType = {
    data: lotesType[];
    elemento: string
    titulo: string
    tituloId?: string | null

}


export default function GraficoBarrasLotesDatos({
    data, elemento, titulo, tituloId=null
}: propsType): JSX.Element {
    const chartRef = useRef<Chart | null>(null);
    let trueTitulo
    if(tituloId){
        const tiposCalidades = useTipoFrutaStore(state => state.tiposCalidades);
        trueTitulo = tipoCalidad(tituloId, tiposCalidades);
    }

    useEffect(() => {
        const canvas = document.getElementById(`myChart_indicadores_operativo_eficiencia_predios_historigrama_${elemento}`) as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cleanup del chart anterior
        chartRef.current?.destroy();

        // Usa el generador de config
        const config = buildEficienciaPrediosBarChartConfig(data, elemento, tituloId ? trueTitulo : titulo);
        chartRef.current = new Chart(ctx, config);

        // Limpieza al desmontar
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [data]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de Kilos {tituloId ? trueTitulo : titulo}</h2>
            <canvas id={`myChart_indicadores_operativo_eficiencia_predios_historigrama_${elemento}`} width="700" height="350"></canvas>
        </div>
    )
}
