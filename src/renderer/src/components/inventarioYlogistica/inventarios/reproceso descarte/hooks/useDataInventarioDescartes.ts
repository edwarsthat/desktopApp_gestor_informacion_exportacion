/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import useAppContext from "@renderer/hooks/useAppContext"
import { FilterValues } from "@renderer/hooks/useFiltro"
import { inventarioDescarteType } from "../types/types"

type outType = {
    data: inventarioDescarteType
    obtenerFruta: () => Promise<void>
}
type propsType = {
    currentFilters: FilterValues
}

export default function useDataInventarioDescartes({ currentFilters }: propsType): outType {
    const initInventario = {
        total: {
            descarteLavado: {
                descarteGeneral: "0",
                pareja: "0",
                balin: "0"
            },
            descarteEncerado: {
                descarteGeneral: "0",
                pareja: "0",
                balin: "0",
                extra: "0",
                suelo: "0",
                frutaNacional: "0"
            }
        }
    }
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<inventarioDescarteType>(initInventario)
    const [dataOriginal, setDataOriginal] = useState<inventarioDescarteType>(initInventario)

    const obtenerFruta = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = { action: 'get_inventarios_frutaDescarte_fruta' };
            const frutaActual = await window.api.server2(request)
            if (frutaActual.status !== 200) throw new Error(`Code ${frutaActual.status}: ${frutaActual.message}`)
            setDataOriginal(frutaActual.data)

            const newObject = obtener_total_inventario(frutaActual.data)
            setData(newObject)

        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", `${e.message}`)
            }
        } finally {
            setLoading(false)
        }
    }

    const obtener_total_inventario = (allData: inventarioDescarteType): inventarioDescarteType=> {
        if (!allData) return initInventario
        const inventario = structuredClone(initInventario)
        Object.keys(allData).forEach(fruta => {
            if(!allData[fruta]) return
            Object.entries(allData[fruta]).forEach(([keyTipoDescarte, tipoDescarte]) => {
                if(!allData[fruta][keyTipoDescarte]) return
                Object.entries(tipoDescarte).forEach(([key, value]) => {
                    inventario.total[keyTipoDescarte][key] =  String(Number(value) + Number(inventario.total[keyTipoDescarte][key]))
                })
            })
        })
        return inventario
    }

    useEffect(() => {
        if (currentFilters.tipoFruta === '') {
            const newObject = obtener_total_inventario(dataOriginal)
            setData(newObject)
        } else {
            const newObject = structuredClone(dataOriginal[currentFilters.tipoFruta])
            setData({total:newObject})
        }
    }, [currentFilters])

    return { data, obtenerFruta }
}
