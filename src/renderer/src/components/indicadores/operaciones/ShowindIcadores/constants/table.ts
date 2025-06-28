/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import { getISOWeek } from "date-fns";
import { IndicadorKilosProcesados } from "../validations/types";

export const TABLE_COLUMNS_EFICIENCIA = {
    dia: [
        { header: "Fecha", value: (item): string => formatearFecha(item.fecha) },
        { header: "Duración Turno", value: (item): number => item.duracion_turno_horas?.toFixed(2) ?? 0 },
        { header: "Eficiencia Kilos Hora", value: (item): string => `${item.eficiencia_procesado_hora?.toFixed(2) ?? 0} %` },
    ],
    semana: [
        { header: "Semana", value: (item): number => getISOWeek(new Date(item.fecha)) },
        { header: "Promedio Duración Turno", value: (item): number => item.duracion_turno_horas?.toFixed(2) ?? 0 },
        { header: "Promedio Eficiencia Kilos Hora", value: (item): string => `${item.eficiencia_procesado_hora?.toFixed(2) ?? 0} %` },
    ],
    mes: [
        { header: "Mes", value: (item): number => (new Date(item.fecha).getMonth() + 1) },
        { header: "Promedio Duración Turno", value: (item): number => item.duracion_turno_horas?.toFixed(2) ?? 0 },
        { header: "Promedio Eficiencia Kilos Hora", value: (item): string => `${item.eficiencia_procesado_hora?.toFixed(2) ?? 0} %` },
    ]
};


export const TABLE_KILOS_HORA = {
    dia: [
        { header: "Fecha", value: (item: IndicadorKilosProcesados):string => formatearFecha(item.fecha) },
        { header: "Meta Kilos/Hora", value: (item: IndicadorKilosProcesados):string => item.meta_kilos_hora?.toFixed(2) ?? 0 },
        { header: "Duración Turno", value: (item: IndicadorKilosProcesados):string => item.duracion_turno_horas?.toFixed(2) ?? 0 },
        { header: "Meta Kilos Turno", value: (item: IndicadorKilosProcesados):string => item.meta_kilos_turno?.toFixed(2) ?? 0 },
        { header: "Kilos Procesados (Kg)", value: (item: IndicadorKilosProcesados):string => item.kilos_vaciados?.toFixed(2) ?? 0 },
        { header: "Kilos Procesados (Hora)", value: (item: IndicadorKilosProcesados):string => item.kilos_hora?.toFixed(2) ?? 0 },
    ],
    semana: [
        { header: "Semana", value: (item: IndicadorKilosProcesados):number => getISOWeek(new Date(item.fecha)) },
        { header: "Promedio Meta Kilos/Hora", value: (item: IndicadorKilosProcesados):string => item.meta_kilos_hora?.toFixed(2) ?? 0 },
        { header: "Promedio Duración Turno", value: (item: IndicadorKilosProcesados):string => item.duracion_turno_horas?.toFixed(2) ?? 0 },
        { header: "Promedio Meta Kilos Turno", value: (item: IndicadorKilosProcesados):string => item.meta_kilos_turno?.toFixed(2) ?? 0 },
        { header: "Promedio Kilos Procesados (Kg)", value: (item: IndicadorKilosProcesados):string => item.kilos_vaciados?.toFixed(2) ?? 0 },
        { header: "Promedio Kilos Procesados (Hora)", value: (item: IndicadorKilosProcesados):string => item.kilos_hora?.toFixed(2) ?? 0 },
    ],
    mes: [
        { header: "Mes", value: (item: IndicadorKilosProcesados):number => (new Date(item.fecha).getMonth() + 1) },
        { header: "Promedio Meta Kilos/Hora", value: (item: IndicadorKilosProcesados):string => item.meta_kilos_hora?.toFixed(2) ?? 0 },
        { header: "Promedio Duración Turno", value: (item: IndicadorKilosProcesados):string => item.duracion_turno_horas?.toFixed(2) ?? 0 },
        { header: "Promedio Meta Kilos Turno", value: (item: IndicadorKilosProcesados):string => item.meta_kilos_turno?.toFixed(2) ?? 0 },
        { header: "Promedio Kilos Procesados (Kg)", value: (item: IndicadorKilosProcesados):string => item.kilos_vaciados?.toFixed(2) ?? 0 },
        { header: "Promedio Kilos Procesados (Hora)", value: (item: IndicadorKilosProcesados):string => item.kilos_hora?.toFixed(2) ?? 0 },
    ]
};