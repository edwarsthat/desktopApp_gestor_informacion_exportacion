/* eslint-disable prettier/prettier */

export type indicadoresType = {
    _id: string
    fecha_creacion: string,
    kilos_procesados: number
    kilos_vaciados: string
    kilos_exportacion: frutaExportacionType,
    meta_kilos_procesados: string
    meta_kilos_procesados_hora: string
    total_horas_hombre: string
    tipo_fruta: string[]
    kilos_meta_hora: string
    duracion_turno_horas: string
}

type frutaExportacionType = {
    [key: string]: number
}