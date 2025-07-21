/* eslint-disable prettier/prettier */

import { loteEF8Type } from "@renderer/types/loteEf8";
import { recordLotesType } from "@renderer/types/recorLotesType";

export const totalKilosEf8 = (item: loteEF8Type): number  => {
    return (item.pareja || 0) + (item.balin || 0) + (item.descarteGeneral || 0);
}
export const totalKilosIngresos = (item: (loteEF8Type | recordLotesType)[] | undefined): number => {
    if (!item || item.length === 0) return 0;
    let total = 0;

    for (const lote of item) {
        if('documento' in lote) {
            total += lote.documento.kilos || 0;
        } else {
            total += totalKilosEf8(lote as loteEF8Type) || 0;
        }
    }
    return total
}