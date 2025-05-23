/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { descarteType } from "../types/types"
import useAppContext from "@renderer/hooks/useAppContext"
import { FilterValues } from "@renderer/hooks/useFiltro"

type outType = {
    data: descarteType[]
    obtenerFruta: () => Promise<void>
}
type propsType = {
    currentFilters: FilterValues
}

export default function useDataInventarioDescartes({ currentFilters }: propsType): outType {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<descarteType[]>([])
    const [dataOriginal, setDataOriginal] = useState<descarteType[]>([])

    const obtenerFruta = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = { action: 'get_inventarios_frutaDescarte_fruta' };
            const frutaActual = await window.api.server2(request)
            if (frutaActual.status !== 200) throw new Error(`Code ${frutaActual.status}: ${frutaActual.message}`)
            setData(frutaActual.data)
            setDataOriginal(frutaActual.data)
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", `${e.message}`)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if (currentFilters.tipoFruta === ''){
            setData(dataOriginal)
        } else if (currentFilters.tipoFruta === 'Limon') {
            const dataLimon = dataOriginal.filter((item) => item.tipoFruta === 'Limon')
            setData(dataLimon)
        } else if (currentFilters.tipoFruta === 'Naranja') {
            const dataNaranja = dataOriginal.filter((item) => item.tipoFruta === 'Naranja')
            setData(dataNaranja)
        } else if (currentFilters.tipoFruta === 'Mandarina') {
            const dataMandarina = dataOriginal.filter((item) => item.tipoFruta === 'Mandarina')
            setData(dataMandarina)
        }
    },[currentFilters])

    return { data, obtenerFruta }
}
