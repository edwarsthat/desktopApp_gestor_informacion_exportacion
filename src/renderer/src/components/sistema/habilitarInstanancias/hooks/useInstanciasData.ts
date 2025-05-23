/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType";
import { useEffect, useState } from "react";

type outType = {
    lotes: lotesType[]
    obtenerLotes: () => Promise<void>
}

export function useInstanciasData():outType {
    const { messageModal, setLoading } = useAppContext();
    const [lotes, setLotes] = useState<lotesType[]>([]);

    const obtenerLotes = async ():Promise<void> => {
        try{
            setLoading(true)
            const request = {
                action:"get_sistema_habilitarInstancias_lotes"
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setLotes(response.data)
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        obtenerLotes()
    },[])
    return {
        lotes,
        obtenerLotes
    }
}