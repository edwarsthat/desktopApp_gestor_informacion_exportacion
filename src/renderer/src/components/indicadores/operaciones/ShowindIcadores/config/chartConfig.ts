/* eslint-disable prettier/prettier */
// src/utils/chartConfigBuilders.ts

import { IndicadorKilosProcesados } from '../validations/types';
import { formatearFecha } from '@renderer/functions/fechas';
import { convertir_fecha_a_mes, convertir_fecha_a_semana } from '../function';
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

