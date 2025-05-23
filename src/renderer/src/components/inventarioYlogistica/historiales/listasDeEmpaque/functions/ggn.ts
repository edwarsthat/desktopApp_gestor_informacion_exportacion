/* eslint-disable prettier/prettier */

import { contenedoresType, EF1Type } from "@renderer/types/contenedoresType";

export function aplicar_ggn_code(item: EF1Type, contenendor: contenedoresType): string {
    if (
        item.lote?.GGN &&
        item.lote.GGN.code &&
        item.lote.GGN.tipo_fruta.includes(item.tipoFruta)
    ) {
        if (typeof contenendor.infoContenedor.clienteInfo === 'object') {
            const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
            const lote = item.lote.GGN.paises
            if (lote.some(elemento => cont.includes(elemento))) {
                return item.lote.GGN.code
            }
        }
    }
    return ""
}

export function mostrar_CoC(contenedor: contenedoresType): boolean {
    if (contenedor.pallets.length > 0 && typeof contenedor.infoContenedor.clienteInfo === 'object') {
        for (let i = 0; i < contenedor.pallets.length; i++) {
            const pallet = contenedor.pallets[i];
            for (let j = 0; j < pallet.EF1.length; j++) {
                const element = pallet.EF1[j];
                if (element.GGN) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function aplicar_ggn_fecha(item: EF1Type, contenendor: contenedoresType): string {
    if (
        item.lote?.GGN &&
        item.lote.GGN.code &&
        item.lote.GGN.tipo_fruta.includes(item.tipoFruta)
    ) {
        if (typeof contenendor.infoContenedor.clienteInfo === 'object') {
            const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
            const lote = item.lote.GGN.paises
            if (lote.some(elemento => cont.includes(elemento))) {
                return item.lote.GGN.fechaVencimiento
            }
        }
    }
    return ""
}
