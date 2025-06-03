/* eslint-disable prettier/prettier */

import { clientesNacionalesType } from "./clientesType"

export type despachoDescartesType = {
    _id: string
    fecha:string
    placa:string
    nombreConductor:string
    telefono:string
    cedula:string
    remision:string
    tipoFruta:string
    user:string
    kilos: number
    cliente: clientesNacionalesType
    descarteLavado:{
        descarteGeneral:number
        pareja:number
        balin:number
    }
    descarteEncerado:{
        descarteGeneral:number
        pareja:number
        balin:number
        extra:number
        suelo:number
        frutaNacional:number
    }
}

