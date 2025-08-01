/* eslint-disable prettier/prettier */

import { obtener_proveedores2 } from "@renderer/functions/SystemRequest"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { useState } from "react"
import { clientesNacionalesType, clienteType } from "@renderer/types/clientesType"
import { tiposFrutasType } from "@renderer/types/tiposFrutas"
import { userType } from "@renderer/types/cuentas"

type outType = {
    proveedores: proveedoresType[]
    obtenerPredios: () => Promise<void>
    tiposFruta: string[]
    obtenerTipoFruta: () => Promise<void>
    tiposFruta2: tiposFrutasType[]
    obtenerTipoFruta2: () => Promise<void>
    dataDefectos: object
    obtenerDefectos: () => Promise<void>
    clientesNacionales: clientesNacionalesType[]
    obtenerClientesNacionales: () => Promise<void>
    clientes: clienteType[]
    obtenerClientes: () => Promise<void>
    ef8: string
    obtenerEf8: () => Promise<void>
    ef1: string
    obtenerEf1: () => Promise<void>
    operarios: userType[]
    obtenerOperarios: () => Promise<void>
}

type propsType = {
    proveedoresProp?: string
}

export default function useGetSysData({ proveedoresProp = 'all' }: propsType): outType {
    const [proveedores, setProveedores] = useState<proveedoresType[]>([])
    const [tiposFruta, setTiposFruta] = useState<string[]>([])
    const [tiposFruta2, setTiposFruta2] = useState<tiposFrutasType[]>([])
    const [dataDefectos, setDataDefectos] = useState<object>({})
    const [clientesNacionales, setClientesNacionales] = useState<clientesNacionalesType[]>([])
    const [clientes, setClientes] = useState<clienteType[]>([])
    const [ef8, setEf8] = useState<string>("")
    const [ef1, setEf1] = useState<string>("")

    const [operarios, setOperarios] = useState<userType[]>([])

    const obtenerPredios = async (): Promise<void> => {
        try {
            const response = await obtener_proveedores2(proveedoresProp)
            if (response instanceof Error) {
                throw response
            }
            const data = response.sort((a: proveedoresType, b: proveedoresType) => a.PREDIO.localeCompare(b.PREDIO));
            setProveedores(data)
        } catch (err) {
            if (err instanceof Error) {
                console.error("error", err.message)
            }
        }
    }
    const obtenerTipoFruta = async (): Promise<void> => {
        try {
            const response = await window.api.obtenerFruta()
            setTiposFruta(response)
        } catch (err) {
            if (err instanceof Error)
                console.error("error", err.message)
        }
    }
    const obtenerTipoFruta2 = async (): Promise<void> => {
        try {
            const response = await window.api.obtenerFruta2()
            setTiposFruta2(response)
        } catch (err) {
            if (err instanceof Error)
                console.error("error", err.message)
        }
    }
    const obtenerDefectos = async (): Promise<void> => {
        try {
            const request = {
                action: "get_constantes_sistema_clasificacion_descarte"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setDataDefectos(response.data)
        } catch (err) {
            if (err instanceof Error) {
                console.error("error", err.message)
            }
        }
    }
    const obtenerClientesNacionales = async (): Promise<void> => {
        try {
            const request = {
                action: "get_comercial_clientesNacionales"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setClientesNacionales(response.data.clientes)
        } catch (err) {
            if (err instanceof Error) {
                console.error("error", err.message)
            }
        }
    }
    const obtenerClientes = async (): Promise<void> => {
        try {
            const request = {
                action: "get_data_clientes"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            console.log("responseClientes", response)
            setClientes(response.data)
        } catch (err) {
            if (err instanceof Error) {
                console.error("error", err.message)
            }
        }
    }
    const obtenerEf8 = async (): Promise<void> => {
        try {
            const request = {
                action: "get_data_EF8"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setEf8(response.data)
        } catch (err) {
            if (err instanceof Error) {
                console.error("error", err.message)
            }
        }
    }
    const obtenerEf1 = async (): Promise<void> => {
        try {
            const request = {
                action: "get_data_EF1"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            console.log("responseEF1", response)
            setEf1(response.data)
        } catch (err) {
            if (err instanceof Error) {
                console.error("error", err.message)
            }
        }
    }
    const obtenerOperarios = async (): Promise<void> => {
        try {
            const request = { action: "get_calidad_ingresos_operariosVolanteCalidad" }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setOperarios(response.data);
        } catch (err) {
            if (err instanceof Error) {
                console.error("error", err.message)
            }
        }
    }
    return {
        proveedores,
        obtenerPredios,
        tiposFruta,
        obtenerTipoFruta,
        tiposFruta2,
        obtenerTipoFruta2,
        dataDefectos,
        clientes,
        obtenerClientes,
        obtenerDefectos,
        clientesNacionales,
        obtenerClientesNacionales,
        ef8,
        obtenerEf8,
        operarios,
        obtenerOperarios,
        ef1,
        obtenerEf1,
    }
}