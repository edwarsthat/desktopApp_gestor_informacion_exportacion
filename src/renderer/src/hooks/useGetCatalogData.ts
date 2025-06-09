/* eslint-disable prettier/prettier */

import { useState } from "react"
import useAppContext from "./useAppContext"
import { cuartosDesverdizadosType } from "@renderer/types/cuartosdesverdizados"

type outType = {
    cuartosDesverdizados: cuartosDesverdizadosType[]
    obtenerCuartosDesverdizados: () => Promise<void>
}

export default function useGetCatalogData(): outType {
    const { messageModal } = useAppContext();
    const [cuartosDesverdizados, setCuartosDesverdizados] = useState<cuartosDesverdizadosType[]>([])

    const obtenerCuartosDesverdizados = async (): Promise<void> => {
        try {
            const request = {
                action: "get_data_cuartosDesverdizados"
            }
            const response = await window.api.server2(request)
            if(response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            console.log("response.data", response.data)
            setCuartosDesverdizados(response.data)
        } catch (err) {
            if (err instanceof Error)
                messageModal("error", `Error obteniendo la fruta ${err.message} `)
        }
    }

    return {
        cuartosDesverdizados,
        obtenerCuartosDesverdizados,
    }
}