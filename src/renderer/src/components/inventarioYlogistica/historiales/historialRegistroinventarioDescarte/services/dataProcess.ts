/* eslint-disable prettier/prettier */

import { InventarioDescarte } from "../registroInventarioDescartes";

export const sumarDataDescartes = (item: InventarioDescarte, tipo: string): number => {
    let total = 0;

    for (const tipoFruta in item[tipo]) {
        if (!item[tipo][tipoFruta]) continue;
        for (const tipoDescarte in item[tipo][tipoFruta]) {
            if (!item[tipo][tipoFruta][tipoDescarte]) continue;
            for (const subtipo in item[tipo][tipoFruta][tipoDescarte]) {
                total += parseInt(item[tipo][tipoFruta][tipoDescarte][subtipo]);
            }
        }
    }
    return total
}
export const sumarTipoFruta = (item: InventarioDescarte, tipoFruta: string): number => {
    let total = 0;

    for (const tipoDescarte in item.inventario[tipoFruta]) {
        if (!item.inventario[tipoFruta][tipoDescarte]) continue;
        for (const subtipo in item.inventario[tipoFruta][tipoDescarte]) {
            if (!item.inventario[tipoFruta][tipoDescarte][subtipo]) continue;
            total += Number(item.inventario[tipoFruta][tipoDescarte][subtipo]);
        }
    }
    return total;
}
export const sumarTipoDescarte = (item: InventarioDescarte, tipoFruta: string, tipoDescarte: string): number => {
    let total = 0;

    for (const subtipo in item.inventario[tipoFruta][tipoDescarte]) {
        if (!item.inventario[tipoFruta][tipoDescarte][subtipo]) continue;
        total += Number(item.inventario[tipoFruta][tipoDescarte][subtipo]);
    }
    return total;
}
export const sumarDescompuestaHojas = (item: InventarioDescarte, tipo: string): number => {
    let total = 0;
    const keys = ["descompuesta", "hojas",]

    for (const tipoFruta in item[tipo]) {
        if (!item[tipo][tipoFruta]) continue;
        for (const tipoDescarte in item[tipo][tipoFruta]) {
            if (!item[tipo][tipoFruta][tipoDescarte]) continue;
            for (const subtipo in item[tipo][tipoFruta][tipoDescarte]) {
                if (keys.includes(subtipo)) {
                    total += parseInt(item[tipo][tipoFruta][tipoDescarte][subtipo]);
                }
            }
        }
    }
    return total
}