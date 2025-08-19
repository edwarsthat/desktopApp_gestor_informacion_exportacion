/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType"

type NumLike = number | undefined | null;

const toNum = (v: NumLike): number => Number(v ?? 0);

export const sumObject = (obj: Record<string, NumLike> | undefined | null): number => {
    return Object.values(obj ?? {}).reduce<number>((s, v: NumLike) => {
        return s + toNum(v);
    }, 0);
};
export const sumBy = <T>(arr: T[], select: (x: T) => NumLike): number =>
    arr.reduce((s, x) => s + toNum(select(x)), 0);

export const averageBy = <T>(arr: T[], select: (x: T) => NumLike): number =>
    arr.length === 0 ? 0 : sumBy(arr, select) / arr.length;

//#region descartes
export const sumaDescarte = (lote: lotesType, descarte: string): number =>
    sumObject(lote?.[descarte] as Record<string, NumLike>);

export const totalDescarteLotes = (lotes: lotesType[], descarte: string): number =>
    sumBy(lotes, (l) => sumaDescarte(l, descarte));

export const promedioDescartes = (datos: lotesType[], llave: keyof lotesType & string): number =>
    averageBy(datos, (l) => sumObject(l?.[llave] as Record<string, NumLike>));


//#region exportacion
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
export function totalExportacionLotes(lotes: lotesType[]): number {
    return lotes.reduce((acu, item) => acu += totalExportacion(item), 0);
}
export const promedioExportacion = (datos: lotesType[]): number => {
    return averageBy(datos, totalExportacion);
};

//#region desverdizado
export const totalDataDesverdizado = (datos: lotesType[]): number => {
    const sumatoria = datos.reduce((acu, item) => {
        if (item && item.desverdizado && item.desverdizado.kilosIngreso) {
            return acu += item.desverdizado.kilosIngreso
        } else {
            return acu += 0
        }
    }, 0);
    return sumatoria
}
export const promedioDesverdizado = (datos: lotesType[]): number => {
    return averageBy(datos, (l) => l.desverdizado?.kilosIngreso ?? 0);
};