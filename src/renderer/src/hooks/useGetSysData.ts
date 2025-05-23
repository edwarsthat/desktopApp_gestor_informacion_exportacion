/* eslint-disable prettier/prettier */

import { obtener_proveedores2 } from "@renderer/functions/SystemRequest"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { useState } from "react"
import useAppContext from "./useAppContext"

type outType = {
    proveedores: proveedoresType[]
    obtenerPredios: () => Promise<void>
    tiposFruta: string[]
    obtenerTipoFruta: () => Promise<void>
}

type propsType = {
    proveedoresProp?: string
}

export default function useGetSysData({ proveedoresProp = 'all' }:propsType): outType {
    const { messageModal } = useAppContext();
    const [proveedores, setProveedores] = useState<proveedoresType[]>([])
    const [tiposFruta, setTiposFruta] = useState<string[]>([])

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
                messageModal("error", err.message)
            }
        }
    }

    const obtenerTipoFruta = async (): Promise<void> => {
        try {
            const response = await window.api.obtenerFruta()
            setTiposFruta(response)
        } catch (err) {
            if (err instanceof Error)
                messageModal("error", `Error obteniendo la fruta ${err.message} `)
        }
    }

    return {
        proveedores,
        obtenerPredios,
        tiposFruta,
        obtenerTipoFruta
    }
}