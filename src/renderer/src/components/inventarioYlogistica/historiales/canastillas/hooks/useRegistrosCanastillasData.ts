/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { canastillasRegistrosType } from "@renderer/types/canastillasRegistrosType";
import { useState } from "react";

type returntype = {
    registros: canastillasRegistrosType[] | undefined
    numeroRegistros: number
    obtenerRegistro: () => Promise<void>
    obtenerNumeroRegistros: () => Promise<void>
}

type filtroType = {
    fechaInicio?: string,
    fechaFin?: string
}


type propsType = {
    filtro: filtroType | undefined
    page: number
}

export function useRegistrosCanastillasData(props: propsType): returntype {
    const { messageModal, setLoading } = useAppContext();
    const [registros, setRegistros] = useState<canastillasRegistrosType[]>();
    const [numeroRegistros, setNumeroRegistros] = useState<number>(0)


    const obtenerRegistro = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "get_inventarios_historiales_canastillas_registros",
                filtro: props.filtro,
                page: props.page
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setRegistros(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    const obtenerNumeroRegistros = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "get_inventarios_historiales_numeroCanastillas_registros",
                filtro: props.filtro,
                page: props.page
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setNumeroRegistros(response.data)

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        registros,
        numeroRegistros,
        obtenerRegistro,
        obtenerNumeroRegistros
    }
}
