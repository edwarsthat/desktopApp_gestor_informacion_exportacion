/* eslint-disable prettier/prettier */

export const initialValues = {
    descarteGeneral: "",
    pareja: "",
    balin: "",
    enf: "",
    fecha_ingreso_inventario: "",
    numeroPrecintos: "",
    numeroRemision: "",
    observaciones: "",
    placa: "",
    precio: "",
    predio: "",
    tipoFruta: "",
}

export type formType = typeof initialValues;
    
export const formKeys = {
    descarteGeneral: "Descarte General",
    pareja: "Pareja",
    balin: "Balin",
    fecha_ingreso_inventario: "Fecha de Ingreso al Inventario",
    numeroPrecintos: "Número de Precintos",
    numeroRemision: "Número de Remisión",
    observaciones: "observaciones",
    placa: "placa",
    precio: "precio",
    predio: "predio",
}