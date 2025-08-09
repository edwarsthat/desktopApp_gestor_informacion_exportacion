/* eslint-disable prettier/prettier */

import { tiposFrutasType } from "@renderer/types/tiposFrutas";

export const nombreTipoFruta2 = (tipoFruta: string, tiposFrutas:tiposFrutasType[]):string => {
    if(!tipoFruta) return "N/A";
    const fruta = tiposFrutas.find(item => item._id === tipoFruta);
    return fruta ? fruta.tipoFruta : tipoFruta;
}