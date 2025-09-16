/* eslint-disable prettier/prettier */

import { contenedoresType, EF1Type } from "@renderer/types/contenedoresType";



export function obtenerItem(contenedor:contenedoresType, _idItem:string): EF1Type | null {
    for (const pallet of contenedor.pallets) {
        for (const item of pallet.EF1) {
            if (item._id === _idItem) {
                return item;
            }
        }
    } 
    return null;
}
