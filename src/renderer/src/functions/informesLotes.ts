/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { lotesType } from "@renderer/types/lotesType"


export function obtenerPorcentage(dato: number, total: number): number {
    return ((dato * 100) / total)
}
export function totalExportacion(lote: lotesType): number {
    let total = 0;
    if (!lote) return total;

    for (const cont of Object.values(lote.exportacion)) {
        for (const key of Object.keys(cont)) {
            total += cont[key];
        }
    }
    return total;
}
export function totalExportacionCalidad(lote: lotesType, calidad:string): number {
    let total = 0;
    if (!lote) return total;

    for (const cont of Object.values(lote.exportacion)) {
        for (const key of Object.keys(cont)) {
            if(key === calidad)
                total += cont[key];
        }
    }
    return total;
}
export function totalDescarte(lote: lotesType): number {
    let descarteEncerado: number
    let descarteLavado: number
    if (lote.descarteEncerado) {
        descarteEncerado = Object.values(lote.descarteEncerado).reduce((acu, value) => acu += value, 0)
    } else {
        descarteEncerado = 0
    }
    if (lote.descarteLavado) {
        descarteLavado = Object.values(lote.descarteLavado).reduce((acu, value) => acu += value, 0)
    } else {
        descarteLavado = 0
    }
    let deshidratacion
    if (lote.deshidratacion) {
        deshidratacion = lote.deshidratacion === 0 ? 0 :
            (lote.deshidratacion / 100) * lote.kilos
    }

    return descarteEncerado + descarteLavado + deshidratacion
}
export function totalLote(lote: lotesType): number {
    const descarte = totalDescarte(lote);
    const fruta_nacional = lote.frutaNacional ?? 0;
    const total_exportacion = totalExportacion(lote) ?? 0;
    return total_exportacion + descarte + lote.directoNacional + fruta_nacional
}
export function getDataToInformeCalidad(lote: lotesType, contenedores: contenedoresType[]): void | null {
    if (!lote) return null;
    const { tipoFruta, fechaIngreso, predio, kilos, enf } = lote;

    const outArr: (string | number)[][] = [];

    outArr.push(
        [tipoFruta.tipoFruta, tipoFruta.tipoFruta === 'Limon' ? "Tahiti" : "Naranja"],
        [fechaIngreso, predio?.DEPARTAMENTO],
        [predio?.PREDIO, predio?.ICA.code, predio?.GGN.code],
        [kilos, enf],
        [contenedores.reduce((acu, cont) => (acu += cont.numeroContenedor + "-"), ' ')]
    );

    console.log(outArr)
}
export const dataInformeInit = {
    datosGenerales: [],
    resultadosExportacion: [],
    resultadosDescarte: [],
}
export type dataInformeType = {
    datosGenerales: string[];
    resultadosExportacion: (string | number)[];
    resultadosDescarte: (string | number)[];
}
export function descarte_pagos(lote): number {
    const total_lavado = Object.entries(lote.descarteLavado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key !== "descompuesta" && key !== "hojas") {
            return acu + (value as number);
        }
        return acu;
    }, 0);
    const total_encerado = Object.entries(lote.descarteEncerado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key !== "descompuesta" && key !== "hojas") {
            return acu + (value as number);
        }
        return acu;
    }, 0);

    const deshidratacion = (lote.deshidratacion === 0 ? 0 : lote.deshidratacion / 100)
        * lote.kilos
    const total = total_encerado + total_lavado + deshidratacion
    return total
}
export function descarte_nopago(lote): number {
    const total_lavado = Object.entries(lote.descarteLavado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key === "descompuesta" || key === "hojas") {
            return acu + (value as number);
        }
        return acu;
    }, 0);
    const total_encerado = Object.entries(lote.descarteEncerado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key === "descompuesta" || key === "hojas") {
            return acu + (value as number);
        }
        return acu;
    }, 0);


    const total = total_encerado + total_lavado
    return total
}
export function totalPrecios(lote: lotesType): number {
    if (!lote.predio) {
        throw new Error("Lote predio is undefined");
    }
    const descarteLavado = lote.descarteLavado
        ? Object.keys(lote.descarteLavado).reduce((acu, item) => {
            if (item === 'descompuesta' || item === 'hojas') {
                return acu + 0
            }
            else if (lote.flag_balin_free && item === 'balin') {
                return acu + 0
            } else {
                const cantidad = lote.descarteLavado && lote.descarteLavado[item];
                return acu + ((lote.precio?.descarte ?? 0) * cantidad);
            }
        }, 0)
        : 0;

    const descarteEncerado = lote.descarteEncerado
        ? Object.keys(lote.descarteEncerado).reduce((acu, item) => {
            if (item === 'descompuesta') {
                return acu
            }
            else if (lote.flag_balin_free && item === 'balin') {
                return acu
            } else {
                const cantidad = lote.descarteEncerado && lote.descarteEncerado[item];
                return acu + (lote.precio?.descarte ?? 0) * cantidad;
            }
        }, 0)
        : 0;

    const exportacion = precioExportacion(lote) ?? 0;

    const deshidratacion = lote.deshidratacion === 0 ? 0 :
        ((lote.deshidratacion / 100) * lote.kilos) * (lote.precio?.descarte ?? 0)

    const directoNacional = lote.directoNacional * (lote.precio?.frutaNacional ?? 0)

    const nacional = lote.frutaNacional ? lote.frutaNacional * (lote.precio?.frutaNacional ?? 0) : 0


    return (
        descarteEncerado +
        descarteLavado +
        exportacion +
        deshidratacion +
        directoNacional +
        nacional
    );
}

export function total_precio_descarte(lote: lotesType): number {
    if (lote.descarteLavado === undefined) return 0
    if (lote.descarteEncerado === undefined) return 0

    const descarteLavado = lote.descarteLavado
        ? Object.keys(lote.descarteLavado).reduce((acu, item) => {
            if (item === 'descompuesta' || item === 'hojas') {
                return acu + 0
            }
            else if (lote.flag_balin_free && item === 'balin') {
                return acu + 0
            } else {
                const cantidad = lote.descarteLavado ? lote.descarteLavado[item] : 0;
                return acu + cantidad;
            }
        }, 0)
        : 0;

    const descarteEncerado = lote.descarteEncerado
        ? Object.keys(lote.descarteEncerado).reduce((acu, item) => {
            if (item === 'descompuesta') {
                return acu + 0
            }
            else if (lote.flag_balin_free && item === 'balin') {
                return acu + 0
            } else {
                const cantidad = lote.descarteEncerado ? lote.descarteEncerado[item] : 0;
                return acu + cantidad;
            }
        }, 0)
        : 0;

    const deshidratacion = lote.deshidratacion === 0 ? 0 :
        ((lote.deshidratacion / 100) * lote.kilos)

    return (
        (descarteEncerado * (lote.precio?.descarte ?? 0)) +
        (descarteLavado * (lote.precio?.descarte ?? 0)) +
        (deshidratacion * (lote.precio?.descarte ?? 0))
    );
}
function precioExportacion(lote: lotesType): number {
    let total = 0

    for (const item of Object.values(lote.exportacion)) {
        for (const [key, value] of Object.entries(item)) {
            console.log("exportacion", key)
            total += (lote.precio.exportacion[key] * value || 0)
        }
    }
    return total
}