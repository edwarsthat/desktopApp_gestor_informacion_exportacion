/* eslint-disable prettier/prettier */


export type resultadoObtenerresumenContenedores = Record<string, ResumenFruta>;

export type ResumenFruta = {
  totalCajas: number;
  totalKilos: number;
  fechas: Record<string, resumenPorfruta>;
};

type resumenPorfruta = {
    calibre: datosType,
    calidad: datosType,
}

type datosType = {
    [key: string]: {
        cajas: number,
        cajasP: number,
        kilos: number,
        kilosP: number,
        pallet: number
    }

}

export type resumenContenedores = {
    resumen: resultadoObtenerresumenContenedores
    totalCalidades: string[]
    totalCalibres: string[]
}