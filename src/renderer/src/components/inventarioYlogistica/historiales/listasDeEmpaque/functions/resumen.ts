/* eslint-disable prettier/prettier */
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";

export function resumenCalidad(
    items: itemPalletType[],
    calidad: string,
): object {
    const out = {}
    let total = 0;
    let totalPallets = 0;
    for (const item of items) {
        const calibre = new Set()
        if(item.pallet.numeroPallet > totalPallets) totalPallets = item.pallet.numeroPallet
        total += item.cajas
        if (item.calidad._id === calidad) {
            if (!Object.prototype.hasOwnProperty.call(out, item.calibre)) {
                out[item.calibre] = {
                    cantidad: 0,
                    pallets: 0,
                }
            }
            out[item.calibre].cantidad += item.cajas
            calibre.add(item.calibre)
        }
    }

    Object.keys(out).forEach(item => {
        out[item].pallets = Math.round((out[item].cantidad * totalPallets) / total)
        out[item].porcentage = (out[item].cantidad * 100) / total
    })
    return out
}