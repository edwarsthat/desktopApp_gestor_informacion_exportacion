/* eslint-disable prettier/prettier */

import { useState } from "react";
import useAppContext from "./useAppContext"
import { tiposFrutasType } from "@renderer/types/tiposFrutas";

type typeOut<T> = {
    obtenerData: () => Promise<void>
    obtenerCantidadElementos: () => Promise<void>
    data: T[]
    numeroElementos: number
}

type propsType = {
    page: number
    actionData: string
    actionNumberData: string
    filtro?: { [key: string]: boolean | string | tiposFrutasType }
}

export function useFetchPaginatedList<T>({ page, actionData, actionNumberData, filtro={} }:propsType): typeOut<T> {
    const { setLoading, messageModal } = useAppContext();
    const [data, setData] = useState<T[]>([])
    const [numeroElementos, setNumeroElementos] = useState<number>(1)

    const obtenerData = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: actionData,
                page: page,
                filtro: filtro
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            setData([...response.data])
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        } finally {
            setLoading(false)
        }
    }
    const obtenerCantidadElementos = async (): Promise<void> => {
        try {
            const request = {
                action: actionNumberData,
                filtro: filtro

            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setNumeroElementos(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    return {
        obtenerData,
        obtenerCantidadElementos,
        data,
        numeroElementos
    }
}
