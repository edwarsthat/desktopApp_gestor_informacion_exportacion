/* eslint-disable prettier/prettier */

import { contenedoresType } from "../contenedoresType"

export type vehiculosType = {
        _id: string,
        tipoVehiculo: string,
        codigo: string,
        placa: string,
        conductor: string,
        cedula: string,
        celular: string,
        precinto: string[],
        flete: number,
        unidadCarga: string,
        pesoEstimado: number,
        user: string,
        tipoSalida: string,
        transportadora: string,
        nit: string,
        trailer: string,
        temperatura: string,
        datalogger_id: string,
        marca: string,
        contenedor: contenedoresType,
        fecha: string,
}