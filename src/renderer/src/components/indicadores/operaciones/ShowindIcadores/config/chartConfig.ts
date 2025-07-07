/* eslint-disable prettier/prettier */
// src/utils/chartConfigBuilders.ts

import { IndicadorKilosProcesados, itemExportacionType } from '../validations/types';
import { formatearFecha } from '@renderer/functions/fechas';
import { convertir_fecha_a_mes, convertir_fecha_a_semana, sumar_calibre_tipoFruta, sumar_calidad_tipoFruta, sumar_tipoFruta, total_exportacion, total_procesado } from '../function';
import { ChartConfiguration } from 'chart.js';

// Utilidad para obtener labels según agrupación
export function getLabels(data: IndicadorKilosProcesados[], agrupacion: string): string[] {
    return data.map(item => {
        if (agrupacion === 'dia') {
            return formatearFecha(item.fecha);
        } else if (agrupacion === 'semana') {
            return convertir_fecha_a_semana(item.fecha);
        } else if (agrupacion === 'mes') {
            return convertir_fecha_a_mes(item.fecha);
        } else {
            return item.fecha;
        }
    });
}

export function buildEficienciaKilosHoraChartConfig(
    data: IndicadorKilosProcesados[],
    agrupacion: string
): ChartConfiguration<'bar'> {
    return {
        type: 'bar',
        data: {
            labels: getLabels(data, agrupacion),
            datasets: [
                {
                    label: 'Eficiencia por Turno (%)',
                    data: data.map(item => item.eficiencia_procesado_turno),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Fechas' }
                },
                y: {
                    min: 0,
                    max: 100,
                    title: { display: true, text: 'Porcentaje Eficiencia Turno (%)' }
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
            }
        }
    };
}

export function buildKilosHoraChartConfig(
    data: IndicadorKilosProcesados[],
    agrupacion: string
): ChartConfiguration<'bar'> {
    return {
        type: 'bar',
        data: {
            labels: getLabels(data, agrupacion),
            datasets: [
                {
                    label: 'Kilos Procesados',
                    type: 'bar',
                    data: data.map(item => item.kilos_hora),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Meta Kilos por Hora',
                    type: 'bar',
                    data: data.map(item => item.meta_kilos_hora),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        font: { size: 10 }
                    },
                    title: {
                        display: true,
                        text: 'Fechas'
                    }
                },
                y: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Kilos Procesados'
                    },
                    position: 'left',
                    type: 'linear'
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Porcentaje de Eficiencia (%)'
                    },
                    suggestedMin: 0,
                    suggestedMax: 1
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
            }
        }
    };
}

export function buildExportacionChartConfig(
    dataOriginal: itemExportacionType[], data: itemExportacionType[], filtrosTipoFruta: string[], filtrosCalidad: string[], filtrosCalibre: string[]
): ChartConfiguration<'pie'> {
    // Sumatoria total de kilos procesados y exportados
    // console.log("dataOriginal:", data);

    // const total_kilosProcesados_fruta = filtrosTipoFruta.map(clave => sumar_tipoFruta(dataOriginal, clave)).reduce((acu, item) => acu += item, 0) 

    const total_exportacion_original = filtrosTipoFruta.map(clave => sumar_tipoFruta(dataOriginal, clave)).reduce((acu, item) => acu += item, 0);

    const total_kilosProcesados_fruta = dataOriginal.reduce((sum, item) => sum + (total_procesado(item, filtrosTipoFruta) || 0), 0);
    const total_exportacion_kilos = data.reduce((sum, item) => sum + (total_exportacion(item) || 0), 0);
    const descarte = Math.max(total_kilosProcesados_fruta - total_exportacion_kilos, 0);


    let totales: number[] = []
    let claves: string[] = [];

    if (filtrosTipoFruta.length === 0 && filtrosCalidad.length === 0 && filtrosCalibre.length === 0) {
        totales.push(total_exportacion_kilos)
        totales.push(descarte)
        claves = ['Exportación', 'Descarte'];
    }
    else if (filtrosTipoFruta.length > 0 && filtrosCalidad.length === 0 && filtrosCalibre.length === 0) {
        totales = filtrosTipoFruta.map(clave => sumar_tipoFruta(data, clave));
        totales.push(descarte)
        claves = [...filtrosTipoFruta, 'Descarte'];
    }


    else if (filtrosCalidad.length > 0 && filtrosCalibre.length === 0) {
        const descarte = Math.max(total_kilosProcesados_fruta - total_exportacion_original, 0);
        totales = filtrosCalidad.map(clave => sumar_calidad_tipoFruta(data, filtrosTipoFruta, clave));
        const otros = Math.max(total_exportacion_original - totales.reduce((item, acu) => acu += item, 0), 0);

        totales.push(otros >= 0 ? otros : 0);
        totales.push(descarte)
        claves = [...filtrosCalidad, 'Otros', 'Descarte'];
    }
    else if (filtrosCalibre.length > 0) {
        const descarte = Math.max(total_kilosProcesados_fruta - total_exportacion_original, 0);
        totales = filtrosCalibre.map(clave => sumar_calibre_tipoFruta(data, filtrosTipoFruta, filtrosCalidad, clave));
        const otros = Math.max(total_exportacion_original - totales.reduce((item, acu) => acu += item, 0), 0);


        totales.push(otros >= 0 ? otros : 0);
        totales.push(descarte)
        claves = [...filtrosCalibre, 'Otros', 'Descarte'];
    }
    const DEFAULT_COLORS = [
        'rgba(168, 85, 247, 0.8)',   // morado
        'rgba(59, 130, 246, 0.8)',   // azul
        'rgba(236, 72, 153, 0.8)',   // rosa fuerte
        'rgba(107, 114, 128, 0.8)',  // gris pizarra
        'rgba(180, 83, 9, 0.8)',     // marrón/cobre
        'rgba(132, 204, 22, 0.8)',   // lima (verde más claro, diferente al de Limon)
        'rgba(232, 121, 249, 0.8)',  // fucsia claro
        'rgba(56, 189, 248, 0.8)',   // celeste
        'rgba(20, 184, 166, 0.8)',   // aqua oscuro
        'rgba(202, 138, 4, 0.8)',    // mostaza/miel
        'rgba(101, 163, 13, 0.8)',   // oliva oscuro
        'rgba(14, 165, 233, 0.8)',   // azul cielo brillante
        'rgba(244, 63, 94, 0.8)',    // rosado intenso
        'rgba(71, 85, 105, 0.8)',    // azul grisáceo
        'rgba(245, 158, 11, 0.8)',   // dorado/ámbar
    ];
    const COLOR_MAP: Record<string, string> = {
        'Descarte': 'rgba(239, 68, 68, 0.8)', // rojo
        'Limon': 'rgba(34, 197, 94, 0.8)',    // verde
        'Naranja': 'rgba(251, 146, 60, 0.8)', // naranja
        'otros': 'rgba(94, 234, 212, 0.8)', // turquesa
    };
    const backgroundColors = claves.map((clave, idx) =>
        COLOR_MAP[clave] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
    );
    const borderColors = backgroundColors.map(c => c.replace('0.8', '1'));
    const hoverColors = backgroundColors.map(c => c.replace('0.8', '0.95'));
    return {
        type: 'pie',

        data: {
            labels: claves,
            datasets: [{
                label: 'Distribución',
                data: totales,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                hoverBackgroundColor: hoverColors,
                hoverBorderColor: borderColors,
                hoverBorderWidth: 3
            }]
        },

        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'left',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context): string {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((sum: number, data: number) => sum + data, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value.toLocaleString()} kg (${percentage}%)`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        }
    };
}