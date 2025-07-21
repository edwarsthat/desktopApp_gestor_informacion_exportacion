/* eslint-disable prettier/prettier */

import { proveedoresType } from "./proveedoresType";
import { tiposFrutasType } from "./tiposFrutas";


export type loteEF8Type = {
    _id: string;
    balin: number;
    canastillas: number;
    canastillasPrestadas: number;
    descarteGeneral: number;
    enf: string;
    fecha_ingreso_inventario: string;
    numeroPrecintos: number;
    numeroRemision: string;
    observaciones: string;
    pareja: number;
    placa: string;
    predio: proveedoresType;
    precio: string;
    promedio: number;
    tipoFruta: tiposFrutasType;
    user: string;
    fecha_creacion: string;
}