/* eslint-disable prettier/prettier */

import { volanteCalidadType } from "@renderer/types/formulariosCalidad";
import { indicadoresType } from "@renderer/types/indicadoresType";
import { lotesType } from "@renderer/types/lotesType";
import { getISOWeek } from "date-fns";
import { IndicadoresKilosProcesadosExcelView, IndicadorKilosProcesados } from "./validations/types";

export const eficiencia_operativa = (
    kilos_procesados: number,
    meta_kilos: number,
    horas_hombre: number
): number => {

    if (horas_hombre === 0 || isNaN(horas_hombre)) return 0;
    if (meta_kilos === 0 || isNaN(meta_kilos)) return 0;

    const kilos_hora = kilos_procesados / horas_hombre;
    const kilos_hora_meta = meta_kilos / horas_hombre;
    const eficiencia = (kilos_hora / kilos_hora_meta);

    return eficiencia * 100;
}
const indicadorToIndicadoresKilosProcesados = (indicadores: indicadoresType): IndicadorKilosProcesados => {
    if (!indicadores) return {
        kilos_vaciados: 0,
        kilos_hora: 0,
        fecha: new Date().toISOString(),
        duracion_turno_horas: 0,
        meta_kilos_turno: 0,
        meta_kilos_hora: 0,
        eficiencia_procesado_hora: 0,
        eficiencia_procesado_turno: 0
    };

    const kilos_vaciados_total = Object.values(indicadores.kilos_vaciados || {}).reduce((acu, item) => acu + (typeof item === 'number' ? item : 0), 0);

    const kilos_hora = indicadores.duracion_turno_horas > 0
        ? kilos_vaciados_total / indicadores.duracion_turno_horas
        : 0;
    const metaKilosTurno =
        (typeof indicadores.kilos_meta_hora === 'number' && typeof indicadores.duracion_turno_horas === 'number')
            ? indicadores.kilos_meta_hora * indicadores.duracion_turno_horas
            : 0;
    const eficiencia_proceso_hora = (kilos_hora / (indicadores.kilos_meta_hora || 1)) * 100;
    const eficiencia_proceso_turno = (kilos_vaciados_total / (metaKilosTurno || 1)) * 100;

    return {
        kilos_vaciados: kilos_vaciados_total,
        kilos_hora: kilos_hora || 0,
        fecha: indicadores.fecha_creacion || new Date().toISOString(),
        duracion_turno_horas: indicadores.duracion_turno_horas || 0,
        meta_kilos_turno: metaKilosTurno || 0,
        meta_kilos_hora: indicadores.kilos_meta_hora || 0,
        eficiencia_procesado_hora: eficiencia_proceso_hora || 0,
        eficiencia_procesado_turno: eficiencia_proceso_turno || 0
    }
}
const sumarVaciado = (result: IndicadorKilosProcesados[], indice, indicador: indicadoresType): void => {

    const kilos_vaciados_total = Object.values(indicador.kilos_vaciados || {}).reduce((acu, item) => acu + (typeof item === 'number' ? item : 0), 0);

    const kilos_hora = indicador.duracion_turno_horas > 0
        ? kilos_vaciados_total / indicador.duracion_turno_horas
        : 0;
    const metaKilosTurno =
        (typeof indicador.kilos_meta_hora === 'number' && typeof indicador.duracion_turno_horas === 'number')
            ? indicador.kilos_meta_hora * indicador.duracion_turno_horas
            : 0;
    const eficiencia_proceso_hora = (kilos_hora / (indicador.kilos_meta_hora || 1)) * 100;
    const eficiencia_proceso_turno = (kilos_vaciados_total / (metaKilosTurno || 1)) * 100;

    result[indice].kilos_vaciados = (result[indice].kilos_vaciados || 0) + (kilos_vaciados_total || 0)
    result[indice].kilos_hora = (result[indice].kilos_hora || 0) + kilos_hora
    result[indice].fecha = indicador.fecha_creacion
    result[indice].duracion_turno_horas = (result[indice].duracion_turno_horas || 0) + (indicador.duracion_turno_horas || 0)
    result[indice].meta_kilos_hora = (result[indice].meta_kilos_hora || 0) + (indicador.kilos_meta_hora || 0)
    result[indice].meta_kilos_turno = (result[indice].meta_kilos_turno || 0) + metaKilosTurno
    result[indice].eficiencia_procesado_hora = (result[indice].eficiencia_procesado_hora || 0) + eficiencia_proceso_hora
    result[indice].eficiencia_procesado_turno = (result[indice].eficiencia_procesado_turno || 0) + eficiencia_proceso_turno;
}
export const agruparRegistrosKilospRocesados = (indicadores: indicadoresType[] | undefined, agrupacion: string): IndicadorKilosProcesados[] => {
    if (indicadores === undefined || indicadores.length === 0) return [];
    const result: IndicadorKilosProcesados[] = []
    if (agrupacion === "" || agrupacion === 'dia') return indicadores.map(indicador => indicadorToIndicadoresKilosProcesados(indicador));

    else if (agrupacion === 'semana') {
        const weekObj = {}

        for (const indicador of indicadores) {
            const fecha = new Date(indicador.fecha_creacion);
            const week = `${fecha.getFullYear()}-${getISOWeek(fecha)}`;

            if (result.length === 0) {
                const copiaIndicador = structuredClone(indicador);
                result.push(indicadorToIndicadoresKilosProcesados(copiaIndicador));
                weekObj[week] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha);
                    const week_result = `${fecha_result.getFullYear()}-${getISOWeek(fecha_result)}`;
                    return week_result === week;
                });

                if (indice !== -1) {
                    weekObj[week] += 1;
                    sumarVaciado(result, indice, indicador);
                } else {
                    weekObj[week] = 1;
                    result.push(indicadorToIndicadoresKilosProcesados(indicador));
                }
            }
        }

        return result.map(item => {
            const fecha_result = new Date(item.fecha);
            const weekKey = `${fecha_result.getFullYear()}-${getISOWeek(fecha_result)}`;
            const divisor = weekObj[weekKey] || 1;

            item.kilos_vaciados /= divisor;
            item.kilos_hora /= divisor;
            item.duracion_turno_horas /= divisor;
            item.meta_kilos_turno /= divisor;
            item.meta_kilos_hora /= divisor;

            return item;
        });

    }

    else if (agrupacion === 'mes') {
        const monthObj = {}

        for (const indicador of indicadores) {

            const fecha = new Date(indicador.fecha_creacion);
            const month = `${fecha.getFullYear()}-${fecha.getMonth()}`;

            if (result.length === 0) {
                const copiaIndicador = structuredClone(indicador);
                result.push(indicadorToIndicadoresKilosProcesados(copiaIndicador));
                monthObj[month] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha);
                    const month_result = `${fecha.getFullYear()}-${fecha_result.getMonth()}`;
                    if (month_result === month) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    monthObj[month] += 1;
                    sumarVaciado(result, indice, indicador);

                } else {
                    monthObj[month] = 1;
                    result.push(indicadorToIndicadoresKilosProcesados(indicador));

                }

            }
        }

        return result.map(item => {
            const fecha_result = new Date(item.fecha);
            const month_result = `${fecha_result.getFullYear()}-${fecha_result.getMonth()}`;
            const divisor = monthObj[month_result] || 1;

            item.kilos_vaciados /= divisor;
            item.kilos_hora /= divisor;
            item.duracion_turno_horas /= divisor;
            item.meta_kilos_turno /= divisor;
            item.meta_kilos_hora /= divisor;

            return item;
        });
    }

    return indicadores.map(indicador => indicadorToIndicadoresKilosProcesados(indicador));
}
export const convertir_fecha_a_semana = (fecha: string): string => {
    const fechaObj = new Date(fecha);
    const week = getISOWeek(fechaObj);
    const year = fechaObj.getFullYear();
    return week + "-" + year
}
export const convertir_fecha_a_mes = (fecha: string): string => {
    const fechaObj = new Date(fecha); // Suponiendo que tienes tu objeto Date
    const nombreMes = fechaObj.toLocaleString('es-ES', { month: 'long' });
    return nombreMes
}
export const promedio = (data, key): number => {
    const len = data.length;
    if (len <= 0) return 0;

    const sum = data.reduce((acu, item) => acu += item[key], 0)
    return sum / len;
}
export const total_eficiencia_operativa = (data): number => {
    const kilos_procesados = promedio(data, "kilos_procesador")
    const meta_kilos = promedio(data, "meta_kilos_procesados")
    const horas_hombre = promedio(data, "total_horas_hombre")

    const eficiencia_operativa_data = eficiencia_operativa(
        kilos_procesados,
        meta_kilos,
        horas_hombre
    )

    return eficiencia_operativa_data
}
export const porcentage_exportacion = (kilos_exp, kilos_proc): number => {
    if (kilos_proc === 0) return 0

    return (kilos_exp * 100) / kilos_proc
}
export type outTypeLoteIndicadores = {
    fecha_ingreso: string
    fecha_fin: string
    total_dias: number
}
export const agrupar_lotes = (lotes: lotesType[] | undefined, agrupacion: string): outTypeLoteIndicadores[] => {
    if (lotes === undefined || lotes.length === 0) return [];
    const result: outTypeLoteIndicadores[] = []
    if (agrupacion === "" || agrupacion === 'dia') {
        lotes.forEach(lote => {
            result.push({
                fecha_ingreso: lote.fecha_ingreso_inventario,
                fecha_fin: lote.fecha_finalizado_proceso,
                total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
            })
        })
        console.log("desela funcion que agrupa los lotes", result)

        return result
    }
    else if (agrupacion === 'semana') {
        const weekObj = {}

        lotes.forEach(lote => {
            const fecha = new Date(lote.fecha_ingreso_inventario);
            const week = getISOWeek(fecha)

            if (result.length === 0) {
                result.push({
                    fecha_ingreso: lote.fecha_ingreso_inventario,
                    fecha_fin: lote.fecha_finalizado_proceso,
                    total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                });
                weekObj[week] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha_ingreso);
                    const week_result = getISOWeek(fecha_result)
                    if (week_result === week) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    weekObj[week] += 1;
                    result[indice].total_dias += Math.ceil(lote.dias_inicio_fin ?? 0)

                } else {
                    weekObj[week] = 1;
                    result.push({
                        fecha_ingreso: lote.fecha_ingreso_inventario,
                        fecha_fin: lote.fecha_finalizado_proceso,
                        total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                    })
                }

            }
        })

        const final = result.map(item => {
            const fecha_result = new Date(item.fecha_ingreso);
            const week_result = getISOWeek(fecha_result)
            item.total_dias = (item.total_dias || 0) / weekObj[week_result]


            return item
        })

        console.log("desela funcion que agrupa los lotes", result)

        return final
    } else if (agrupacion === 'mes') {
        const monthObj = {}
        lotes.forEach(lote => {
            const fecha = new Date(lote.fecha_ingreso_inventario);
            const month = fecha.getMonth();

            if (result.length === 0) {
                result.push({
                    fecha_ingreso: lote.fecha_ingreso_inventario,
                    fecha_fin: lote.fecha_finalizado_proceso,
                    total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                });
                monthObj[month] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha_ingreso);
                    const month_result = fecha_result.getMonth();
                    if (month_result === month) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    monthObj[month] += 1;
                    result[indice].total_dias += Math.ceil(lote.dias_inicio_fin ?? 0)

                } else {
                    monthObj[month] = 1;
                    result.push({
                        fecha_ingreso: lote.fecha_ingreso_inventario,
                        fecha_fin: lote.fecha_finalizado_proceso,
                        total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                    })
                }
            }
        })

        const final = result.map(item => {
            const fecha_result = new Date(item.fecha_ingreso);
            const month_result = fecha_result.getMonth();
            item.total_dias = (item.total_dias || 0) / monthObj[month_result]


            return item
        })

        console.log("desela funcion que agrupa los lotes", result)

        return final
    }
    return []
}
export const porcentage_ciclo_predio = (data: outTypeLoteIndicadores): number | string => {
    if (!data) return 0
    if (data.total_dias === 0) return 0

    return (24 / data.total_dias) * 100
}
export const agrupar_volante_calidad = (data: volanteCalidadType[] | undefined, agrupacion: string): volanteCalidadType[] => {
    if (data === undefined || data.length === 0) return [];
    const result: volanteCalidadType[] = []
    if (agrupacion === "" || agrupacion === 'dia') {
        data.forEach(item => {
            const fecha = new Date(item.fecha)
            const dia = fecha.getDay()
            const month = fecha.getMonth()
            const year = fecha.getFullYear()

            if (result.length <= 0) {
                const copiaIndicador = structuredClone(item);
                result.push(copiaIndicador);
            } else {
                const indice = result.findIndex(registro => {
                    const fecha_result = new Date(registro.fecha)
                    const dia_result = fecha_result.getDay()
                    const month_result = fecha_result.getMonth()
                    const year_result = fecha_result.getFullYear()

                    if (
                        dia === dia_result && month === month_result && year === year_result
                    ) {
                        return true
                    } else {
                        return false
                    }
                })
                if (indice === -1) {
                    const copiaIndicador = structuredClone(item);
                    result.push(copiaIndicador);
                } else {
                    result[indice].defectos += (item.defectos ?? 0)
                    result[indice].unidades += (item.unidades ?? 0)
                }


            }
        })
        return result
    } else if (agrupacion === 'semana') {

        data.forEach(item => {
            const fecha = new Date(item.fecha);
            const week = getISOWeek(fecha)
            const year = fecha.getFullYear()


            if (result.length <= 0) {
                const copiaIndicador = structuredClone(item);
                result.push(copiaIndicador);
            } else {
                const indice = result.findIndex(registro => {
                    const fecha_result = new Date(registro.fecha);
                    const week_result = getISOWeek(fecha_result);
                    const year_result = fecha_result.getFullYear()

                    if (week_result === week && year === year_result) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    result[indice].defectos += (item.defectos ?? 0)
                    result[indice].unidades += (item.unidades ?? 0)
                } else {
                    const copiaIndicador = structuredClone(item);
                    result.push(copiaIndicador)
                }
            }
        })

        return result

    } else if (agrupacion === 'mes') {

        data.forEach(item => {
            const fecha = new Date(item.fecha);
            const mes = fecha.getMonth();
            const year = fecha.getFullYear();

            if (result.length <= 0) {
                const copiaItem = structuredClone(item);
                result.push(copiaItem)
            } else {
                const indice = result.findIndex(registro => {
                    const fecha_result = new Date(registro.fecha);
                    const mes_result = fecha_result.getMonth();
                    const year_result = fecha_result.getFullYear();

                    if (mes_result === mes && year_result === year) {
                        return true
                    } else {
                        return false
                    }
                })
                if (indice !== -1) {
                    result[indice].defectos += (item.defectos ?? 0)
                    result[indice].unidades += (item.unidades ?? 0)
                } else {
                    const copiaIndicador = structuredClone(item);
                    result.push(copiaIndicador)
                }
            }
        })

        return result
    }
    return data
}
export const resultado_volante_calidad = (unidades_revisadas: number, novedades: number): number => {
    if (unidades_revisadas === 0) return -1
    return (novedades * 100) / unidades_revisadas
}
export const arreglar_datos_excel_eficiencia = (data: IndicadorKilosProcesados[]): IndicadoresKilosProcesadosExcelView[] => {
    const out: IndicadoresKilosProcesadosExcelView[] = [];
    for (const item of data) {
        out.push({
            Fecha: item.fecha,
            "Duración Turno (Horas)": Number(item.duracion_turno_horas ?? 0),
            "Eficiencia Kilos Hora": typeof item.eficiencia_procesado_hora === "number"
                ? item.eficiencia_procesado_hora / 100
                : 0,
        });
    }
    return out;
};
export const arreglar_datos_excel_kilos_hora = (data: IndicadorKilosProcesados[]): IndicadoresKilosProcesadosExcelView[] => {
    const out: IndicadoresKilosProcesadosExcelView[] = [];
    for (const item of data) {
        out.push({
            Fecha: item.fecha,
            "Duración Turno (Horas)": Number(item.duracion_turno_horas ?? 0),
            "Meta Kilos/Hora": typeof item.eficiencia_procesado_hora === "number" ? item.eficiencia_procesado_hora : 0,
            "Meta Kilos Turno": typeof item.meta_kilos_turno === "number" ? item.meta_kilos_turno : 0,
            "Kilos Procesados": typeof item.kilos_vaciados === "number" ? item.kilos_vaciados : 0,
        });
    }
    return out;
};

