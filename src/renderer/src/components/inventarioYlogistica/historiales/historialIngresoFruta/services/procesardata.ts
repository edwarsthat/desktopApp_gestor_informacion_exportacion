/* eslint-disable prettier/prettier */

import { loteEF8Type } from "@renderer/types/loteEf8";

export const totalKilosEf8 = (item: loteEF8Type): number  => {
    return (item.pareja || 0) + (item.balin || 0) + (item.descarteGeneral || 0);
}