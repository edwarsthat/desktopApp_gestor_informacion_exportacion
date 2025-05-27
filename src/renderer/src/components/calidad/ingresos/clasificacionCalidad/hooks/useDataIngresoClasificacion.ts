/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { lotesType } from "@renderer/types/lotesType";
import { useState } from "react";

type typeOut = {
    obtenerData: () => Promise<void>
    lotesData: lotesType[]
}

export default function useDataIngresoClasificacion(): typeOut {
    const { messageModal } = useAppContext();
    const [lotesData, setLotesData] = useState<lotesType[]>([])

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: 'get_calidad_ingresos_clasificacionDescarte',
            }
            const lotes = await window.api.server2(request)
            if (lotes.status !== 200) {
                throw new Error(`${lotes.message}`);
            }
            setLotesData(lotes.data)
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", `${e.message}`)
            }
        }
    }
    return {
        obtenerData,
        lotesData
    }
}