/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { lotesType } from "@renderer/types/lotesType";
import { useState } from "react";

type outType = {
    data: lotesType[]
    datosOriginales
    : lotesType[]
    obtenerFruta: () => Promise<void>
    setData: (e) => void
    version: number
}

export default function useDataInventarioFrutaSinProcesar(): outType {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<lotesType[]>([])
    const [datosOriginales, setDatosOriginales] = useState<lotesType[]>([]);
    const [version, setVersion] = useState<number>(0);

    const obtenerFruta = async (): Promise<void> => {
        try {
            const request = { action: 'get_inventarios_frutaSinProcesar_frutaEnInventario' };
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setData(response.data.fruta)
            setDatosOriginales(response.data.fruta)
            setVersion(response.data.version);
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message)
            }
        }
    }
    return {
        data,
        datosOriginales,
        obtenerFruta,
        setData,    
        version
    }
}
