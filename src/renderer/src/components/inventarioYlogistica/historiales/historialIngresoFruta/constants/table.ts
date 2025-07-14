/* eslint-disable prettier/prettier */

import { loteEF8Type } from "@renderer/types/loteEf8";
import { totalKilosEf8 } from "../services/procesardata";
import { formatearFecha } from "@renderer/functions/fechas";
import { recordLotesType } from "@renderer/types/recorLotesType";

export const TABLE_COLUMNS_INGRESOS = {
    ef8: [
        { header: "EF", value: (item: loteEF8Type): string => item?.enf || '' },
        { header: "Predio", value: (item: loteEF8Type): string => item?.predio?.PREDIO || '' },
        { header: "Numero de canastillas", value: (item: loteEF8Type): number => item?.canastillas || 0 },
        { header: "Kilos", value: (item: loteEF8Type): string => totalKilosEf8(item)?.toLocaleString('es-ES') },
        { header: "Fecha creación", value: (item: loteEF8Type): string => formatearFecha(item.fecha_creacion, true) },
        { header: "Fecha estimada de llegada", value: (item: loteEF8Type): string => formatearFecha(item.fecha_ingreso_inventario, true) },
        { header: "Tipo de fruta", value: (item: loteEF8Type): string => item.tipoFruta.tipoFruta || '' },
        { header: "GGN", value: ():string => '' },
        { header: "Observaciones", value: (item: loteEF8Type): string => item.observaciones || '' },
        { header: "Placa", value: (item: loteEF8Type): string => item.placa || '' },
        { header: "USER", value: (item: loteEF8Type): string => item.user || '' },
    ],
    ef1: [
        { header: "EF", value: (item: recordLotesType): string => item.documento.enf || '' },
        { header: "Predio", value: (item: recordLotesType): string => item?.documento.predio?.PREDIO || '' },
        { header: "Numero de canastillas", value: (item: recordLotesType): string => item?.documento.canastillas || '' },
        { header: "Kilos", value: (item: recordLotesType): string => item.documento.kilos?.toLocaleString('es-ES') },
        { header: "Fecha creación", value: (item: recordLotesType): string => formatearFecha(item.documento.fecha_creacion, true) },
        { header: "Fecha estimada de llegada", value: (item: recordLotesType): string => formatearFecha(item.documento.fecha_ingreso_inventario, true) },
        { header: "Tipo de fruta", value: (item: recordLotesType): string => item.documento.tipoFruta || '' },
        { header: "GGN", value: (item:recordLotesType): string => item.documento?.GGN ? item.documento?.predio?.GGN?.code : '' },
        { header: "Observaciones", value: (item: recordLotesType): string => item.documento.observaciones|| '' },
        { header: "Placa", value: (item: recordLotesType): string => item.documento.placa || '' },
        { header: "USER", value: (item: recordLotesType): string => item.user || '' },
    ]
}
