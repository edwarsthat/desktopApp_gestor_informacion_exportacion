/* eslint-disable prettier/prettier */

import { proveedoresType } from "../proveedoresType";

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

export type resumenPredios = {
    [loteId: string]: predioType
}

type predioType = {
    enf:string
    predio: proveedoresType
    tipoFruta: string
    cont: {
        [contenedorId: string]: {
            cajas: number
            kilos: number
            numero: number
        }
    }
    calibres: {
        [calibre: string]: {
            cajas: number
            kilos: number
        }
    }
}

export type resumenContenedores = {
    resumen: resultadoObtenerresumenContenedores
    resumenPredios: resumenPredios
    totalCalidades: string[]
    totalCalibres: string[]
    contenedores: string[]
}