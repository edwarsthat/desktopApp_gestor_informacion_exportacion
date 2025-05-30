/* eslint-disable prettier/prettier */

//descarte data
export type descarteLavadoType = {
    descarteGeneral: string
    pareja: string
    balin: string
}

export type descarteEncerado = {
    descarteGeneral: string
    pareja: string
    balin: string
    extra: string
    suelo: string
    frutaNacional: string
}

export type inventarioDescarteType = {
    [key: string]: {
        descarteLavado: descarteLavadoType
        descarteEncerado: descarteEncerado
    }
}

//formulario inventario
export type formType = {
    tipoFruta: string
    "descarteLavado:descarteGeneral":string
    "descarteLavado:pareja":string
    "descarteLavado:balin":string
    "descarteEncerado:descarteGeneral":string
    "descarteEncerado:pareja":string
    "descarteEncerado:balin":string
    "descarteEncerado:extra":string
    "descarteEncerado:suelo":string
    "descarteEncerado:frutaNacional":string
}

//formulario despacho fruta

export type formDespachoType = {
    cliente: string
    placa: string
    nombreConductor: string
    telefono: string
    cedula: string
    remision:string
    kilos:number
}