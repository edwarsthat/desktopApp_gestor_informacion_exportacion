/* eslint-disable prettier/prettier */

import { clientesNacionalesType, clienteType } from "@renderer/types/clientesType"
import { proveedoresType } from "@renderer/types/proveedoresType"

export const obtener_tipo_fruta = async (): Promise<string[] | Error> => {
    const request = { action: "get_constantes_sistema_tipo_frutas" }
    const response = await window.api.server2(request)
    return responsefunction(response)
}

export const obtener_proveedores = async (data = "all"): Promise<proveedoresType[] | Error> => {
    const request = { action: "get_sys_proveedores", data: data }
    const response = await window.api.server2(request)
    return responsefunction(response)
}

export const obtener_proveedores2 = async (data = "all"): Promise<proveedoresType[] | Error> => {
    const request = { action: "get_data_proveedores", data: data }
    const response = await window.api.server2(request)
    return responsefunction(response)
}

export const obtener_clientes = async (): Promise<clienteType[] | Error> => {
    const request = { action: "get_data_clientes" }
    const response = await window.api.server2(request)
    return responsefunction(response)
} 

export const obtener_clientes_nacionales = async (): Promise<clientesNacionalesType[] | Error> => {
    const request = { action: "get_data_clientesNacionales" }
    const response = await window.api.server2(request)
    return responsefunction(response)
}

const responsefunction = <T>(response: {status: number, data:T, message:string}): T | Error => {
    if (response.status !== 200)
        return new Error(`Code ${response.status}: ${response.message}`)
    return response.data
}