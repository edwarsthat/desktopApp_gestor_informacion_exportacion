/* eslint-disable prettier/prettier */

export type indicadoresType = {
    _id: string
    fecha_creacion: string,
    kilos_procesados: kilosProcesadosSchema,
    kilos_vaciados: kilosProcesadosSchema,
    kilos_exportacion: kilosExportacionSchema,
    kilos_meta_hora: number,
    duracion_turno_horas: number,
}

export type kilosProcesadosSchema = {
    [key: string]: number
}

export type KilosExportacionSchema = {
    [tipoFruta: string]: {
        [calidad: string]: {
            [calibre: string]: number;
        };
    };
};