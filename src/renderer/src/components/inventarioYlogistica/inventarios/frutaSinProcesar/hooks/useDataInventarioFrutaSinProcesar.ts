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
}

export default function useDataInventarioFrutaSinProcesar(): outType {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<lotesType[]>([])
    const [datosOriginales, setDatosOriginales] = useState<lotesType[]>([]);

    const obtenerFruta = async (): Promise<void> => {
        try {
            const request = { action: 'get_inventarios_frutaSinProcesar_frutaEnInventario' };
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            console.log(response.data);
            setData(response.data)
            setDatosOriginales(response.data)
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
        setData
    }
}
