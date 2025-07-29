/* eslint-disable prettier/prettier */

import { loteEF8Type } from "@renderer/types/loteEf8";
import { totalKilosEf8 } from "../services/procesardata";
import { formatearFecha } from "@renderer/functions/fechas";
import { lotesType } from "@renderer/types/lotesType";

export const TABLE_COLUMNS_INGRESOS = {
    ef8: [
        { header: "EF", value: (item: loteEF8Type): string => item?.enf || '' },
        { header: "Predio", value: (item: loteEF8Type): string => item?.predio?.PREDIO || '' },
        { header: "Numero de canastillas", value: (item: loteEF8Type): number => (item?.canastillas || 0) + (item?.canastillasPrestadas || 0) },
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
        { header: "EF", value: (item: lotesType): string => item.enf || '' },
        { header: "Predio", value: (item: lotesType): string => item.predio?.PREDIO || '' },
        { header: "Numero de canastillas", value: (item: lotesType): string => item?.canastillas || '' },
        { header: "Kilos", value: (item: lotesType): string => item.kilos?.toLocaleString('es-ES') },
        { header: "Fecha creación", value: (item: lotesType): string => formatearFecha(item.fecha_creacion, true) },
        { header: "Fecha estimada de llegada", value: (item: lotesType): string => formatearFecha(item.fecha_ingreso_inventario, true) },
        { header: "Tipo de fruta", value: (item: lotesType): string => item.tipoFruta.tipoFruta || '' },
        { header: "GGN", value: (item:lotesType): string => item?.GGN ? item?.predio?.GGN?.code : '' },
        { header: "Observaciones", value: (item: lotesType): string => item.observaciones|| '' },
        { header: "Placa", value: (item: lotesType): string => item.placa || '' },
        { header: "USER", value: (item: lotesType): string => item.user || '' },
    ]
}
