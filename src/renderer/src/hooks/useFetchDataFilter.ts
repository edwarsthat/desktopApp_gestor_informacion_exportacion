/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useState } from "react";
import { FilterValues } from "./useFiltro";


type propsType = {
    currentFilters: FilterValues
    actionData: string
    otherFilter?: { [key: string]: boolean | string }
}

type typeOut<T> = {
    obtenerData: () => Promise<void>
    data: T[]
}

export default function useFetchDataFilter<T>({ currentFilters, actionData, otherFilter }: propsType): typeOut<T> {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<T[]>([])
    // const [dataOriginal, setDataOriginal] = useState<historialLotesType[]>([])

    const obtenerData = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                filtro: {
                    ...currentFilters,
                    ...otherFilter
                },
                action: actionData,

            }
            console.log("Request:", request)
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                messageModal("error", `Error ${response.status}: ${response.message}`)
            }
            setData(response.data)
            // setDataOriginal(frutaActual.data)
        } catch (e: unknown) {
            if (e instanceof Error) {
                messageModal("error", `Error: ${e.message}`);
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        obtenerData,
        data
    }
}
