/* eslint-disable prettier/prettier */

import { obtener_proveedores2 } from "@renderer/functions/SystemRequest"
import useAppContext from "@renderer/hooks/useAppContext"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { useState } from "react"

type outType = {
    enf: string
    tiposFrutas: string[]
    prediosDatos: proveedoresType[]
    obtener_ef: () => Promise<void>
    obtenerTipoFruta: () => Promise<void>
    obtenerPredios: () => Promise<void>
}

export function useIngresoLotesData(): outType {
    const { messageModal } = useAppContext();
    const [enf, setEnf] = useState<string>("")
    const [tiposFrutas, setTiposFrutas] = useState<string[]>([])
    const [prediosDatos, setPrediosData] = useState<proveedoresType[]>([])

    const obtener_ef = async (): Promise<void> => {
        try {
            const request = { action: "get_inventarios_ingresos_ef" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setEnf(response.data.ef1)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    const obtenerTipoFruta = async (): Promise<void> => {
        try {
            const response = await window.api.obtenerFruta()
            setTiposFrutas(response)
        } catch (err) {
            if (err instanceof Error)
                messageModal("error", `Error obteniendo fruta ${err.message}`)
        }
    }

    const obtenerPredios = async (): Promise<void> => {
        try {
            const response = await obtener_proveedores2("activos")
            if (response instanceof Error) {
                throw response
            }
            const data = response.sort((a: proveedoresType, b: proveedoresType) => a.PREDIO.localeCompare(b.PREDIO));
            console.log(data)
            setPrediosData(data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    return {
        enf,
        tiposFrutas,
        prediosDatos,
        obtener_ef,
        obtenerTipoFruta,
        obtenerPredios
    }
}