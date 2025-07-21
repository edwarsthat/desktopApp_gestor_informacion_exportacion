/* eslint-disable prettier/prettier */

import { KilosExportacionSchema, kilosProcesadosSchema } from "@renderer/types/indicadoresType";

export type IndicadorKilosProcesados = {
    kilos_vaciados: number;
    kilos_hora: number;
    fecha: string;
    duracion_turno_horas: number;
    meta_kilos_turno: number;
    meta_kilos_hora: number;
    eficiencia_procesado_turno: number;
    eficiencia_procesado_hora: number;
}

export type IndicadoresKilosProcesadosExcelView = {
    [key: string]: string | number;
}

export type filtrosExportacionesType = {
    tipoFruta: string[]
    calidad: string[]
    calibre: string[]
}

export type filtroExportacionesSelectType = {
    tipoFruta: boolean
    calidad: boolean
    calibre: boolean
}

export type itemExportacionType = {
    fecha:string;
    kilos_exportacion: KilosExportacionSchema
    kilos_procesados: kilosProcesadosSchema;
}

export type itemExportacionExcelType = {
    fecha: string;
    kilos_exportacion: number;
    kilos_procesados: number;
    porcentaje_exportacion: number;
}

export type totalesLotesType = {
    totalKilosIngreso: number;
    totalKilosProcesados: number;
    totalKilosExportacion: number;
    totalKilosDescarte: number;
}