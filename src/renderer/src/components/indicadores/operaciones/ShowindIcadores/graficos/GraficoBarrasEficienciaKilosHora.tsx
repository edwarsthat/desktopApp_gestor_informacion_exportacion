/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from 'chart.js/auto';
import { useEffect, useRef } from "react";
import { formatearFecha } from '@renderer/functions/fechas';
import { convertir_fecha_a_mes, convertir_fecha_a_semana } from '../function';
import { IndicadorKilosProcesados } from '../validations/types';

type propsType = {
    data: IndicadorKilosProcesados[]
    agrupacion: string
}

export default function GraficoBarrasEficienciaKilosHora(props: propsType): JSX.Element {
    const chartRef = useRef<Chart<any> | null>(null);

    useEffect(() => {
        // Configurar Chart.js para usar colores que funcionen bien con fondo blanco
        Chart.defaults.color = '#333333';
        Chart.defaults.borderColor = '#e0e0e0';
        Chart.defaults.backgroundColor = '#ffffff';


        if (chartRef.current) {
            chartRef.current.data.labels = props.data.map(item => {
                if (props.agrupacion === 'dia') {
                    return formatearFecha(item.fecha)
                } else if (props.agrupacion === 'semana') {
                    return convertir_fecha_a_semana(item.fecha)
                } else if (props.agrupacion === 'mes') {
                    return convertir_fecha_a_mes(item.fecha)
                } else {
                    return item.fecha
                }
            });
            chartRef.current.data.datasets[0].data = props.data.map(item => item.eficiencia_procesado_turno);

            chartRef.current.update();
        } else {
            const canvas = document.getElementById('myChart_indicadores_operativo_eficiencia_kilos_hora') as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    chartRef.current = new Chart(ctx, {
                        // NOTA: aunque definimos 'type: bar' aquí,
                        // podemos agregar datasets de tipo 'line' sin problema
                        type: 'bar',
                        data: {
                            labels: props.data.map(item => formatearFecha(item.fecha)),
                            datasets: [
                                {
                                    label: 'Eficiencia por Turno (%)',
                                    type: 'bar',
                                    data: props.data.map(item => item.eficiencia_procesado_turno),
                                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            // Configuramos dos ejes Y: uno para las barras y otro para la línea
                            scales: {
                                x: {
                                    stacked: false, // ❌ ya no apilamos
                                    ticks: {
                                        font: { size: 10 }
                                    },
                                    title: {
                                        display: true,
                                        text: 'Fechas'
                                    }
                                },
                                y: {
                                    type: 'linear',
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'Porcentaje Eficiencia Turno (%)'
                                    },
                                    min: 0,
                                    max: 100
                                }
                            },
                            plugins: {
                                legend: {
                                    position: 'top'
                                },
                                tooltip: {
                                    enabled: true
                                }
                            }
                        }
                    });
                    
                    // Forzar fondo blanco del canvas
                    const canvasElement = canvas;
                    canvasElement.style.backgroundColor = '#ffffff';
                }
            }
        }
    }, [props.data]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de Eficiencia de Procesado (%)</h2>
            <canvas id="myChart_indicadores_operativo_eficiencia_kilos_hora" width="700" height="350"></canvas>
        </div>
    )
}
