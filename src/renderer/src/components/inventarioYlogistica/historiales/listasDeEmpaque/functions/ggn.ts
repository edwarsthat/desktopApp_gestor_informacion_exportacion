/* eslint-disable prettier/prettier */

import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";
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

export function mostrar_CoC(items: itemPalletType[]): boolean {
    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (element.GGN) {
                return true;
            }
        }
    }
    return false;
}

export function aplicar_ggn_fecha(item: itemPalletType): string {

    if (item.GGN) {
        return item.lote.predio.GGN.fechaVencimiento
    }

    return ""
}
