/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { FilterValues } from "@renderer/hooks/useFiltro"
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"

type outType = {
    obtenerFruta: () => Promise<void>
    data: lotesType[]
}



export function useDataInventarioDesverdizado( currentFilters : FilterValues): outType {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<lotesType[]>([])
    const [dataOriginal, setDataOgirinal] = useState<lotesType[]>([])

    const obtenerFruta = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: 'get_inventarios_frutaDesverdizando_lotes'
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setData(response.data)
            setDataOgirinal(response.data)
        } catch (e: unknown) {
            messageModal("error", `${e}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let dataFiltrada = dataOriginal
        if (currentFilters.GGN){
            dataFiltrada = dataFiltrada.filter(lote => lote.GGN)
        }
        if(currentFilters.buscar){
            dataFiltrada = dataFiltrada.filter(lote => (
                lote.enf.toLowerCase().includes(currentFilters.buscar.toLowerCase()) ||
                lote.predio.PREDIO.toLowerCase().includes(currentFilters.buscar.toLowerCase()) 
            ))
        }
        setData(dataFiltrada)
    }, [currentFilters])

    return {
        obtenerFruta,
        data
    }
}