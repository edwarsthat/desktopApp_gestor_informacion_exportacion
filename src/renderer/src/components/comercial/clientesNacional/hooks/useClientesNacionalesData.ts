/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { clientesNacionalesType } from "@renderer/types/clientesType";
import { useState } from "react";

type outType = {
    clientes: clientesNacionalesType[]
    numeroClientes: number
    page: number
    obtenerCliente: () => Promise<void>
    setPage: (e:number) => void
}

export function useClientesNacionalesData(): outType {
    const { messageModal, setLoading} = useAppContext();
    const [clientes, setClientes] = useState<clientesNacionalesType[]>([])
    const [numeroClientes, setNumeroClientes] = useState<number>(0)
    const [page, setPage] = useState<number>(1)

    const obtenerCliente = async (): Promise<void> => {
        try{
            setLoading(true)
            const request = {
                action:"get_comercial_clientesNacionales"
            }
            const response = await window.api.server2(request)
            if( response.status !== 200 )
                throw new Error(`Code ${response.status}: ${response.message}`)
            setClientes(response.data.clientes)
            setNumeroClientes(response.data.cantidad)
        } catch(err){
            if (err instanceof Error){
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return {
        clientes,
        numeroClientes,
        page,
        setPage,
        obtenerCliente
    }
}
