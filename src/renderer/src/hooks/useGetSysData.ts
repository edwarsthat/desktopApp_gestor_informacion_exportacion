/* eslint-disable prettier/prettier */

import { obtener_proveedores2 } from "@renderer/functions/SystemRequest"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { useState } from "react"
import useAppContext from "./useAppContext"
import { clientesNacionalesType } from "@renderer/types/clientesType"

type outType = {
    proveedores: proveedoresType[]
    obtenerPredios: () => Promise<void>
    tiposFruta: string[]
    obtenerTipoFruta: () => Promise<void>
    dataDefectos: object
    obtenerDefectos: () => Promise<void>
    clientesNacionales: clientesNacionalesType[]
    obtenerClientesNacionales: () => Promise<void>
}

type propsType = {
    proveedoresProp?: string
}

export default function useGetSysData({ proveedoresProp = 'all' }: propsType): outType {
    const [proveedores, setProveedores] = useState<proveedoresType[]>([])
    const [tiposFruta, setTiposFruta] = useState<string[]>([])
    const [dataDefectos, setDataDefectos] = useState<object>({})
    const [clientesNacionales, setClientesNacionales] = useState<clientesNacionalesType[]>([])

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

    return {
        proveedores,
        obtenerPredios,
        tiposFruta,
        obtenerTipoFruta,
        dataDefectos,
        obtenerDefectos,
        clientesNacionales,
        obtenerClientesNacionales
    }
}